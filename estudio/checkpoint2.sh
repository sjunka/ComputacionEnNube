#!/usr/bin/env bash
# Monta y desmonta los Labs 05, 06 y 07 para el Checkpoint Lab 2.
# Uso: bash estudio/checkpoint2.sh up|down|status [05|06|07]
#   up 05 06 07   monta esos labs (sin número: los tres). Si un lab ya existe, lo salta.
#   down          cleanup de los tres. Encuentra los recursos por nombre: sirve en una shell nueva.
#   status        qué hay montado.
# Las pruebas (GetObject, subir el objeto, ver la alarma) se hacen a mano en la demo: eso es lo que se evalúa.
set -euo pipefail
export AWS_REGION=us-east-1 AWS_PAGER=""
ACC=$(aws sts get-caller-identity --query Account --output text)
HERE=$(cd "$(dirname "$0")" && pwd)
TMP=$(mktemp -d)
VPC=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=dcl-dev-vpc --query 'Vpcs[0].VpcId' --output text)
SUBA=$(aws ec2 describe-subnets --filters Name=tag:Name,Values=dcl-dev-subnet-a --query 'Subnets[0].SubnetId' --output text)

B05=dcl-s05-team01-$ACC
POL05=arn:aws:iam::$ACC:policy/dcl-dev-policy-s3-read-allowed-s05
STACK=dcl-dev-stack-ops-s06
B07=dcl-s07-team01-$ACC
FN=dcl-dev-order-event-s07
LG=/aws/lambda/$FN

log() { echo "[$(date +%H:%M:%S)] $*"; }
existe_bucket() { aws s3api head-bucket --bucket "$1" >/dev/null 2>&1; }
id_por_tag() { # tipo-de-recurso nombre
  case $1 in
    igw) aws ec2 describe-internet-gateways --filters Name=tag:Name,Values=$2 --query 'InternetGateways[0].InternetGatewayId' --output text ;;
    rt)  aws ec2 describe-route-tables --filters Name=tag:Name,Values=$2 --query 'RouteTables[0].RouteTableId' --output text ;;
    sg)  aws ec2 describe-security-groups --filters Name=group-name,Values=$2 Name=vpc-id,Values=$VPC --query 'SecurityGroups[0].GroupId' --output text ;;
    ec2) aws ec2 describe-instances --filters Name=tag:Name,Values=$2 Name=instance-state-name,Values=pending,running,stopped --query 'Reservations[0].Instances[0].InstanceId' --output text ;;
  esac
}

up05() {
  if existe_bucket "$B05"; then log "05: ya existe $B05, lo salto"; return; fi
  log "05: bucket privado con allowed/ y restricted/"
  aws s3api create-bucket --bucket "$B05" >/dev/null
  aws s3api put-public-access-block --bucket "$B05" --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
  echo 'Digital Café Luna — lectura autorizada' > "$TMP/context.txt"
  echo 'Digital Café Luna — recurso restringido' > "$TMP/secret.txt"
  aws s3api put-object --bucket "$B05" --key allowed/context.txt --body "$TMP/context.txt" >/dev/null
  aws s3api put-object --bucket "$B05" --key restricted/secret.txt --body "$TMP/secret.txt" >/dev/null

  log "05: policy solo s3:GetObject sobre allowed/*, role e instance profile"
  cat > "$TMP/pol.json" <<J
{"Version":"2012-10-17","Statement":[{"Sid":"ReadAllowedPrefixOnly","Effect":"Allow","Action":"s3:GetObject","Resource":"arn:aws:s3:::$B05/allowed/*"}]}
J
  cat > "$TMP/trust.json" <<J
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}
J
  aws iam create-policy --policy-name dcl-dev-policy-s3-read-allowed-s05 --policy-document "file://$TMP/pol.json" >/dev/null
  aws iam create-role --role-name dcl-dev-role-s05 --assume-role-policy-document "file://$TMP/trust.json" >/dev/null
  aws iam attach-role-policy --role-name dcl-dev-role-s05 --policy-arn "$POL05"   # queda como AttachRolePolicy en CloudTrail
  aws iam create-instance-profile --instance-profile-name dcl-dev-role-s05 >/dev/null
  aws iam add-role-to-instance-profile --instance-profile-name dcl-dev-role-s05 --role-name dcl-dev-role-s05

  log "05: subnet A pública temporal (IGW + route table) y SG con SSH solo desde EC2 Instance Connect"
  local IGW RT SG PL AMI IID
  IGW=$(aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=dcl-dev-igw-s05}]' --query InternetGateway.InternetGatewayId --output text)
  aws ec2 attach-internet-gateway --internet-gateway-id "$IGW" --vpc-id "$VPC"
  RT=$(aws ec2 create-route-table --vpc-id "$VPC" --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=dcl-dev-rt-public-a-s05}]' --query RouteTable.RouteTableId --output text)
  aws ec2 create-route --route-table-id "$RT" --destination-cidr-block 0.0.0.0/0 --gateway-id "$IGW" >/dev/null
  aws ec2 associate-route-table --route-table-id "$RT" --subnet-id "$SUBA" >/dev/null
  SG=$(aws ec2 create-security-group --group-name dcl-dev-sg-ec2-s05 --description "EC2 S05: SSH desde EC2 Instance Connect" --vpc-id "$VPC" --query GroupId --output text)
  PL=$(aws ec2 describe-managed-prefix-lists --filters Name=prefix-list-name,Values=com.amazonaws.us-east-1.ec2-instance-connect --query 'PrefixLists[0].PrefixListId' --output text)
  aws ec2 authorize-security-group-ingress --group-id "$SG" --ip-permissions "IpProtocol=tcp,FromPort=22,ToPort=22,PrefixListIds=[{PrefixListId=$PL}]" >/dev/null

  log "05: EC2 con el instance profile (IAM tarda unos segundos en propagar)"
  AMI=$(aws ssm get-parameter --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64 --query Parameter.Value --output text)
  sleep 10
  IID=$(aws ec2 run-instances --image-id "$AMI" --instance-type t3.micro --subnet-id "$SUBA" --security-group-ids "$SG" \
    --associate-public-ip-address --iam-instance-profile Name=dcl-dev-role-s05 \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=dcl-dev-ec2-s05}]' --query 'Instances[0].InstanceId' --output text)
  aws ec2 wait instance-running --instance-ids "$IID"
  log "05: listo. EC2 $IID. Conéctate por EC2 Instance Connect y corre: export BUCKET=$B05 (ver app, fase 4)"
}

up06() {
  if aws cloudformation describe-stacks --stack-name $STACK >/dev/null 2>&1; then log "06: ya existe $STACK, lo salto"; return; fi
  log "06: create-stack v1 (la alarma tarda 25–35 min en pasar a ALARM)"
  aws cloudformation create-stack --stack-name $STACK --template-body "file://$HERE/../evidencias/lab-evolutivo-06/s06-ops-cloudformation.yaml" \
    --parameters ParameterKey=VpcId,ParameterValue="$VPC" ParameterKey=SubnetId,ParameterValue="$SUBA" \
    ParameterKey=CpuThreshold,ParameterValue=70 ParameterKey=LabRevision,ParameterValue=v1 >/dev/null
  aws cloudformation wait stack-create-complete --stack-name $STACK
  log "06: CREATE_COMPLETE. Update a v2 en la demo: CloudFormation › Update › Use existing template › LabRevision=v2"
}

up07() {
  if existe_bucket "$B07"; then log "07: ya existe $B07, lo salto"; return; fi
  log "07: bucket privado y log group con retención de 1 día"
  aws s3api create-bucket --bucket "$B07" >/dev/null
  aws s3api put-public-access-block --bucket "$B07" --public-access-block-configuration BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
  aws logs create-log-group --log-group-name $LG
  aws logs put-retention-policy --log-group-name $LG --retention-in-days 1

  log "07: execution role solo con permisos de Logs (sin S3)"
  cat > "$TMP/trust.json" <<J
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}
J
  cat > "$TMP/logs.json" <<J
{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["logs:CreateLogStream","logs:PutLogEvents"],"Resource":"arn:aws:logs:us-east-1:$ACC:log-group:$LG:*"}]}
J
  aws iam create-role --role-name dcl-dev-role-lambda-s07 --assume-role-policy-document "file://$TMP/trust.json" >/dev/null
  aws iam put-role-policy --role-name dcl-dev-role-lambda-s07 --policy-name dcl-s07-logs-only --policy-document "file://$TMP/logs.json"

  log "07: función Lambda (Python 3.14)"
  cat > "$TMP/lambda_function.py" <<'PY'
import json
import logging
from urllib.parse import unquote_plus

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    for record in event.get('Records', []):
        payload = {
            'bucket': record['s3']['bucket']['name'],
            'key': unquote_plus(record['s3']['object']['key']),
            'eventName': record.get('eventName'),
            'eventTime': record.get('eventTime'),
            'requestId': context.aws_request_id
        }
        logger.info(json.dumps(payload))
    return {'records': len(event.get('Records', []))}
PY
  (cd "$TMP" && zip -q function.zip lambda_function.py)
  sleep 10
  aws lambda create-function --function-name $FN --runtime python3.14 --architectures x86_64 --handler lambda_function.lambda_handler \
    --role arn:aws:iam::$ACC:role/dcl-dev-role-lambda-s07 --zip-file "fileb://$TMP/function.zip" >/dev/null
  aws lambda wait function-active-v2 --function-name $FN

  log "07: trigger ObjectCreated con prefix incoming/ y suffix .json (primero el permiso de invocación)"
  aws lambda add-permission --function-name $FN --statement-id s3-invoke-s07 --action lambda:InvokeFunction \
    --principal s3.amazonaws.com --source-arn arn:aws:s3:::$B07 --source-account "$ACC" >/dev/null
  cat > "$TMP/notif.json" <<J
{"LambdaFunctionConfigurations":[{"Id":"s07-incoming-json","LambdaFunctionArn":"arn:aws:lambda:us-east-1:$ACC:function:$FN","Events":["s3:ObjectCreated:*"],
 "Filter":{"Key":{"FilterRules":[{"Name":"prefix","Value":"incoming/"},{"Name":"suffix","Value":".json"}]}}}]}
J
  aws s3api put-bucket-notification-configuration --bucket "$B07" --notification-configuration "file://$TMP/notif.json"
  log "07: listo. En la demo sube incoming/order-001.json y abre el log group $LG"
}

down05() {
  local IID SG RT IGW ASSOC
  IID=$(id_por_tag ec2 dcl-dev-ec2-s05)
  if [[ $IID != None ]]; then log "05: terminando $IID"; aws ec2 terminate-instances --instance-ids "$IID" >/dev/null; aws ec2 wait instance-terminated --instance-ids "$IID"; fi
  SG=$(id_por_tag sg dcl-dev-sg-ec2-s05); [[ $SG != None ]] && aws ec2 delete-security-group --group-id "$SG" >/dev/null
  RT=$(id_por_tag rt dcl-dev-rt-public-a-s05)
  if [[ $RT != None ]]; then
    for ASSOC in $(aws ec2 describe-route-tables --route-table-ids "$RT" --query 'RouteTables[0].Associations[].RouteTableAssociationId' --output text); do
      aws ec2 disassociate-route-table --association-id "$ASSOC"
    done
    aws ec2 delete-route-table --route-table-id "$RT"
  fi
  IGW=$(id_por_tag igw dcl-dev-igw-s05)
  if [[ $IGW != None ]]; then aws ec2 detach-internet-gateway --internet-gateway-id "$IGW" --vpc-id "$VPC"; aws ec2 delete-internet-gateway --internet-gateway-id "$IGW"; fi
  if existe_bucket "$B05"; then aws s3 rm "s3://$B05" --recursive >/dev/null; aws s3api delete-bucket --bucket "$B05"; fi
  aws iam remove-role-from-instance-profile --instance-profile-name dcl-dev-role-s05 --role-name dcl-dev-role-s05 2>/dev/null || true
  aws iam delete-instance-profile --instance-profile-name dcl-dev-role-s05 2>/dev/null || true
  aws iam detach-role-policy --role-name dcl-dev-role-s05 --policy-arn "$POL05" 2>/dev/null || true
  aws iam delete-policy --policy-arn "$POL05" 2>/dev/null || true
  aws iam delete-role --role-name dcl-dev-role-s05 2>/dev/null || true
  log "05: cleanup hecho"
}

down06() {
  if aws cloudformation describe-stacks --stack-name $STACK >/dev/null 2>&1; then
    log "06: delete-stack"
    aws cloudformation delete-stack --stack-name $STACK
    aws cloudformation wait stack-delete-complete --stack-name $STACK
  fi
  log "06: cleanup hecho"
}

down07() {
  if existe_bucket "$B07"; then
    aws s3api put-bucket-notification-configuration --bucket "$B07" --notification-configuration '{}' >/dev/null
    aws s3 rm "s3://$B07" --recursive >/dev/null
    aws s3api delete-bucket --bucket "$B07"
  fi
  aws lambda delete-function --function-name $FN >/dev/null 2>&1 || true
  aws logs delete-log-group --log-group-name $LG 2>/dev/null || true
  aws iam delete-role-policy --role-name dcl-dev-role-lambda-s07 --policy-name dcl-s07-logs-only 2>/dev/null || true
  aws iam delete-role --role-name dcl-dev-role-lambda-s07 2>/dev/null || true
  log "07: cleanup hecho"
}

status() {
  echo "05: bucket $(existe_bucket "$B05" && echo sí || echo no) · EC2 $(id_por_tag ec2 dcl-dev-ec2-s05) · role $(aws iam get-role --role-name dcl-dev-role-s05 >/dev/null 2>&1 && echo sí || echo no)"
  echo "06: stack $(aws cloudformation describe-stacks --stack-name $STACK --query 'Stacks[0].StackStatus' --output text 2>/dev/null || echo no) · alarma $(aws cloudwatch describe-alarms --alarm-names $STACK-cpu-high --query 'MetricAlarms[0].StateValue' --output text)"
  echo "07: bucket $(existe_bucket "$B07" && echo sí || echo no) · función $(aws lambda get-function --function-name $FN --query Configuration.State --output text 2>/dev/null || echo no) · role $(aws iam get-role --role-name dcl-dev-role-lambda-s07 >/dev/null 2>&1 && echo sí || echo no)"
  echo "Baseline: $(aws ec2 describe-subnets --filters Name=vpc-id,Values=$VPC --query 'Subnets[].[CidrBlock,AvailabilityZone]' --output text | tr '\n\t' '  ')"
}

accion=${1:-status}; shift || true
labs=${*:-05 06 07}
case $accion in
  up)     for l in $labs; do "up$l"; done; status ;;
  down)   for l in $labs; do "down$l"; done; status ;;
  status) status ;;
  *)      echo "uso: bash $0 up|down|status [05|06|07]"; exit 1 ;;
esac
