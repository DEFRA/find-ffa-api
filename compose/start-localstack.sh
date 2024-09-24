#!/bin/bash
export AWS_REGION=eu-west-2
export AWS_DEFAULT_REGION=eu-west-2
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

aws --endpoint-url=http://localhost:4566 dynamodb create-table \
    --table-name ffa-chats \
    --attribute-definitions AttributeName=id,AttributeType=S \
        AttributeName=timestamp,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
    --billing-mode PAY_PER_REQUEST \
    --region eu-west-2
