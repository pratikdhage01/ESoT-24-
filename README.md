# ESoT-24
This project is created for ESoT'24 by Team Nova.

## MedAI
Med-AI is leading the way in healthcare innovation, merging advanced technology with medical expertise to enable early disease detection. Our mission is to provide actionable insights that help individuals and healthcare professionals make informed decisions for improved health outcomes.

To achieve this vision, we present Baymax, our revolutionary AI model. Trained on over 130 symptoms, Baymax can accurately detect more than 40 diseases.

Baymax's extensive symptom database allows it to identify subtle patterns and correlations that traditional diagnostic methods might miss. By providing reliable disease predictions, Baymax empowers healthcare professionals and patients with the knowledge needed for early intervention and treatment planning.

## Dataset

The dataset for fine-tuning the Gemini model can be downloaded from:

[Download Dataset](https://www.kaggle.com/kaushil268/disease-prediction-using-machine-learning)

The complete dataset consists of two CSV files: one for training and one for testing the model. Each CSV file contains 133 columns, with 132 columns representing symptoms and the last column indicating the prognosis. These symptoms are mapped to 42 diseases, enabling classification based on symptom sets. You are required to train your model on the training data and test it on the testing data.

## Tech Stack Used:
### ML Tech Stack:
- **Supervised Machine Learning:** Synthesizes symptom patterns using supervised learning for accurate disease detection.
- **Gemini 1.0 Pro and 1.5 Flash:** Utilized for disease prediction and generating helpful text.
- **Streamlit:** Facilitates seamless connection between the ML model and web UI.

### Web Tech Stack:
- **Node.js:** JavaScript runtime environment for building scalable server-side applications.
- **Express.js:** Streamlined framework for creating a web interface for user symptom submission.
- **Body Parser:** Efficiently extracts symptom data (JSON, form data) from user submissions for disease prediction analysis.

## Presentation
[Team Nova.pptx](https://github.com/user-attachments/files/15859545/Team.Nova.pptx)
