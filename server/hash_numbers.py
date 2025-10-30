import django
from django.conf import settings
from django.contrib.auth.hashers import make_password

# Minimal Django setup
settings.configure()

# Your phone numbers list
numbers = [
    "9137426652", "8591743628", "8369322726", "9773885949", "8983355425",
    "7021116514", "7977643201", "9702359261", "9136371212", "9321659572",
    "8669713695", "7710814752", "9226451578", "9321649774", "9833000734",
    "7718017656", "8983170422", "9987580370", "8454941760", "9138508420",
    "8591695229", "9920230493", "9967629496", "9833470970", "7021550824",
    "9049565857", "8169559284", "8082747607", "8691952960", "7021074133",
    "9372931114", "9076234454", "7506853971", "8779491086", "7499405973",
    "9619553093", "9699791265", "9967959787", "9321235271", "8433597178",
    "9004330748", "8108053272", "8169101393", "9321878246"
]

# Hash each number
hashed_numbers = [make_password(num) for num in numbers]

# Print in CSV-friendly format
print("mobile,hashed_password")
for num, hashed in zip(numbers, hashed_numbers):
    print(f"{hashed}")
