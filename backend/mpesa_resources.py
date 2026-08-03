import uuid

from flask import jsonify, request
from flask_restful import Resource
from mpesa_service import mpesa_service


class STKPushResource(Resource):
    def post(self):
        data = request.get_json(force=True, silent=True)
        if not data:
            return {"error": "Invalid request body"}, 400

        required_fields = ['amount', 'callbackUrl', 'invoiceNumber', 'phoneNumber', 'transactionDescription']
        missing_fields = [f for f in required_fields if f not in data]
        if missing_fields:
            return {"error": f"Missing required fields: {', '.join(missing_fields)}"}, 400

        phoneNumber = data.get('phoneNumber')
        amount = data.get('amount')
        invoiceNumber = data.get('invoiceNumber')
        callbackUrl = data.get('callbackUrl')
        transactionDescription = data.get('transactionDescription')
        orgShortCode = data.get('orgShortCode')
        orgPassKey = data.get('orgPassKey')
        sharedShortCode = data.get('sharedShortCode', False)

        messageId = f"BP_{uuid.uuid4().hex[:8]}_{phoneNumber}"

        result = mpesa_service.stk_push(
            phoneNumber=phoneNumber,
            amount=amount,
            invoiceNumber=invoiceNumber,
            callbackUrl=callbackUrl,
            transactionDescription=transactionDescription,
            orgShortCode=orgShortCode,
            orgPassKey=orgPassKey,
            sharedShortCode=sharedShortCode
        )

        if 'error' in result:
            return result, 500

        return result, 200