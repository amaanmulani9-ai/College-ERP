import subprocess
import os
import json

project_id = os.environ.get("STITCH_PROJECT_ID", "12892697107625217698")
api_key = os.environ.get("STITCH_API_KEY", "")

screens = {
    "51f3a2466920443993ca7940183e75f8": "eskooly_landing_page",
    "0689fe8e8b75450ba6257dddecbcb3c2": "eskooly_create_account",
    "837ea84e94814f7bb7c7c49209ceec35": "eskooly_pricing_page",
    "cfdee7ea1f1244c19717f214e92ace04": "about_eskooly",
    "e3ba35b4d20f48d298d59e24135234ad": "contact_eskooly_support",
    "b95c359a0c9f4a2f8166a97330c9b77b": "eskooly_login",
    "6aedcbd3fa4441c5a6e69095c770c396": "eskooly_message_sent_successfully",
    "cf04e52e795540e8ae964bcbc3dbe32d": "eskooly_welcome_dashboard"
}

os.makedirs("scratch/stitch_site_2", exist_ok=True)

env = os.environ.copy()
env["STITCH_API_KEY"] = api_key

for screen_id, name in screens.items():
    print(f"Fetching code for screen {name} ({screen_id})...")
    data_payload = json.dumps({"projectId": project_id, "screenId": screen_id})
    res = subprocess.run(
        ["npx", "@_davideast/stitch-mcp", "tool", "get_screen_code", "--data", data_payload],
        capture_output=True,
        text=True,
        env=env,
        shell=True
    )
    if res.returncode != 0:
        print(f"Error executing npx tool for {name}: {res.stderr}")
        continue
    
    stdout_str = res.stdout
    try:
        json_start = stdout_str.find("{")
        json_end = stdout_str.rfind("}") + 1
        resp_data = json.loads(stdout_str[json_start:json_end])
        if resp_data.get("success"):
            html_content = resp_data.get("html", "")
            out_file = f"scratch/stitch_site_2/{name}.html"
            with open(out_file, "w", encoding="utf-8") as f:
                f.write(html_content)
            print(f"Saved to {out_file} ({len(html_content)} bytes)")
        else:
            print(f"Failed to fetch {name}: {resp_data.get('error')}")
    except Exception as e:
        print(f"Failed to parse JSON for {name}: {e}")
        print("Raw output:", stdout_str)

print("Fetch script completed!")
