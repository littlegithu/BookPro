import requests
import base64
import json
from datetime import datetime
from flask import request, jsonify
from extensions import db


class MpesaService:
    BASE_URL = "https://uat.buni.kcbgroup.com/mm/api/request/1.0.0"
    ROUTE_CODE = "207"

    @staticmethod
    def _get_auth_token():
        pass

    @staticmethod
    def stk_push(phoneNumber, amount, invoiceNumber, callbackUrl, transactionDescription, orgShortCode=None, orgPassKey=None, sharedShortCode=False):
        timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
        messageId = f"BP_{timestamp}_{phoneNumber}"

        headers = {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }

        payload = {
            "phoneNumber": phoneNumber,
            "amount": str(amount),
            "invoiceNumber": invoiceNumber,
            "sharedShortCode": sharedShortCode,
            "orgPassKey": orgPassKey or "",
            "orgShortCode": orgShortCode or "",
            "callbackUrl": callbackUrl,
            "transactionDescription": transactionDescription
        }

        params = {
            'routeCode': MpesaService.ROUTE_CODE,
            'operation': 'STKPush',
            'messageId': messageId
        }

        try:
            response = requests.post(
                f"{MpesaService.BASE_URL}/stkpush",
                headers=headers,
                params=params,
                data=json.dumps(payload)
            )
            return response.json()
        except Exception as e:
            return {"error": str(e)}


mpesa_service = MpesaService()