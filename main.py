import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase = create_client(supabase_url, supabase_key)

app = Flask(__name__)
CORS(app)

@app.route('/new', methods=['POST'])
def add_leaderboard():
    data = request.get_json()
    if data.get("score") >= 100:
        return jsonify({"error": "Score must be less than 100"}), 400
    
    response = supabase.table("leaderboard").insert({
        "player": data.get("player"),
        "score": data.get("score")
    }).execute()
    return jsonify({"success": True, "data": response.data}), 201

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    response = supabase.table("leaderboard").select("player,score").order("score", desc=True).limit(10).execute()
    return jsonify({"leaderboard": response.data}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)