import unittest
from unittest.mock import patch
from fastapi.testclient import TestClient
from server.app import app  

client = TestClient(app)

class TestEventAPI(unittest.TestCase):
    @patch("server.app.requests.get")  
    def test_get_events(self, mock_get):
        # Mock API response
        mock_response = {
            "_embedded": {
                "events": [
                    {
                        "id": "1",
                        "name": "Concert",
                        "url": "https://example.com/event", 
                        "dates": {"start": {"dateTime": "2025-02-01T20:00:00Z"}},
                        "_embedded": {
                            "venues": [
                                {
                                    "name": "Venue Name",
                                    "location": {"latitude": "50.1109", "longitude": "8.6821"}
                                }
                            ]
                        },
                        "images": [{"url": "image_url"}],
                    }
                ]
            }
        }
        mock_get.return_value.status_code = 200
        mock_get.return_value.json.return_value = mock_response

        response = client.get("/api/events?city=Frankfurt&radius=10")
        self.assertEqual(response.status_code, 200)
        self.assertIn("events", response.json())
        self.assertEqual(len(response.json()["events"]), 1)
        self.assertEqual(response.json()["events"][0]["name"], "Concert")
        self.assertEqual(response.json()["events"][0]["url"], "https://example.com/event") 


'''Run the test suite
1. Go to Directory /Software_Engineering_Assignment
2. python3 -m unittest discover -s tests
'''