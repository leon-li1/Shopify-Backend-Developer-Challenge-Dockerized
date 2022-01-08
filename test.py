from fastapi.testclient import TestClient
from main import app
import unittest

class Tests(unittest.TestCase):
    def test_create_success(self):
        with TestClient(app) as client:
            response = client.post('/api/item', json={
                'sku': 'test',
                'name': 'test',
                'description': 'test',
                'color': 'test',
                'size': 'test',
                'count': 1,
            })
            assert response.status_code == 200


if __name__ == '__main__':
    unittest.main()

