from flask import Flask, render_template, request, jsonify
import pickle
import numpy as np

app = Flask(__name__)

# Load trained model
with open("model.pkl", "rb") as file:
    model = pickle.load(file)


# ----------------------------
# Home Page
# ----------------------------
@app.route("/")
def home():
    return render_template("home.html")


# ----------------------------
# About Page
# ----------------------------
@app.route("/about")
def about():
    return render_template("about.html")


# ----------------------------
# Find Your Crop Page
# ----------------------------
@app.route("/findyourcrop")
def findyourcrop():
    return render_template("findyourcrop.html")


# ----------------------------
# Prediction Route
# ----------------------------
@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()

        features = np.array([[
            float(data["N"]),
            float(data["P"]),
            float(data["K"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        ]])

        prediction = model.predict(features)[0]

        return jsonify({

            "success": True,
            "crop": prediction

        })

    except Exception as e:

        return jsonify({

            "success": False,
            "error": str(e)

        })


# ----------------------------
# Run Application
# ----------------------------
if __name__ == "__main__":
    app.run(debug=True)