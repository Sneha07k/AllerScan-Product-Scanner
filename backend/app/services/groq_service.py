import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
# client = Groq(api_key="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")

# client = os.getenv("GROQ_API_KEY")
# print(os.getenv("GROQ_API_KEY"))

# print(client)

def ask_groq(prompt):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        temperature=0.3,
    )

    return response.choices[0].message.content

# import os
# from dotenv import load_dotenv
# from groq import Groq

# load_dotenv()

# print("GROQ KEY =", os.getenv("GROQ_API_KEY"))

# client = Groq(api_key=os.getenv("GROQ_API_KEY"))
