from django.test import TestCase
from django.core.management import call_command
from django.core import mail
from unittest.mock import patch


class TestSendTestCommand(TestCase):

    @patch("emailer.management.commands.send_test.selected_users_emails")
    def test_command_sends_emails(self, mock_utils):
        """
        Test the send_test command without touching DB or real email.
        """

        # Mocked users
        mock_utils.return_value = [
            {"name": "Fareed", "email": "fareed@test.com"},
            {"name": "Zahid",  "email": "zahid@test.com"},
        ]

        # Run command
        call_command("send_test")

        # Check email count
        self.assertEqual(len(mail.outbox), 2)

        # Check subject
        self.assertEqual(
            mail.outbox[0].subject,
            "Congratulations! You have been selected to Nexus as an L0 Contributor"
        )

        # Check recipients
        self.assertEqual(mail.outbox[0].to, ["fareed@test.com"])
        self.assertEqual(mail.outbox[1].to, ["zahid@test.com"])

        # Check personalization
        self.assertIn("Fareed", mail.outbox[0].body)
        self.assertIn("Zahid", mail.outbox[1].body)

        # HTML exists
        self.assertTrue(mail.outbox[0].alternatives)
