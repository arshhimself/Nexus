import django
from django.conf import settings
from django.contrib.auth.hashers import make_password

# Minimal Django setup
settings.configure()

# Your phone numbers list
numbers = [
  "9967665288",
  "9967126455",
  "9004886004",
  "9321552356",
  "9892320250",
  "8983029191"
]


# Hash each number
hashed_numbers = [make_password(num) for num in numbers]

# Print in CSV-friendly format
print("mobile,hashed_password")
for num, hashed in zip(numbers, hashed_numbers):
    print(f"{hashed}")
