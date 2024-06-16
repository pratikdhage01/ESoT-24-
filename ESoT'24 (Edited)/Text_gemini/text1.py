import google.generativeai as genai
import streamlit as st
from PIL import Image
import base64


# Configure the generative AI with the API key
genai.configure(api_key="AIzaSyB98dLzN8OdCdu01MC4D1XUmAjAnU4Puvc")

def set_background(png_file):
    bin_str = get_base64_of_bin_file(png_file)
    page_bg_img = f"""
    <style>
    .stApp {{
        background-image: url("data:image/png;base64,{bin_str}");
        background-size: cover;
    }}
    </style>
    """
    st.markdown(page_bg_img, unsafe_allow_html=True)

def get_base64_of_bin_file(bin_file):
    with open(bin_file, 'rb') as f:
        data = f.read()
    return base64.b64encode(data).decode()

# Set up the Streamlit interface
st.set_page_config(page_title="Generative AI Medical Advice", page_icon="💡", layout="wide")

set_background("background.png")
# Custom CSS for styling
st.markdown(
    """
    <style>
    .main-title {
        font-size: 3rem;
        color: #333333;
        text-align: center;
        margin-bottom: 20px; /* Increase margin bottom for main title */
        text-shadow: 1px 1px 2px #ffffff;
    }
    .sub-title {
        font-size: 1.5rem;
        color: #333333;
        text-align: center;
        margin-top: 0;
        margin-bottom: 30px; /* Increase margin bottom for subtitle */
        text-shadow: 1px 1px 2px #ffffff;
    }
    .input-field {
        margin-top: 50px; /* Increase margin top for input field */
        text-align: center;
    }

    .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        color: #000000; /* Change footer text color to black */
        padding: 10px;
        background-color: rgba(255, 255, 255, 0.7);
        text-shadow: 1px 1px 2px #ffffff;
    }
    .custom-label {
        font-size: 1.2rem;
        color: #333333;
        text-align: center;
        margin-bottom: 5px;
    }
    </style>
    """, unsafe_allow_html=True
)

# Title and subtitle
st.markdown('<div class="main-title">Baymax\'s Advice</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">Your Personal Healthcare Assistant</div>', unsafe_allow_html=True)

# Input field for the medical condition with a custom label
st.markdown('<div class="input-field">', unsafe_allow_html=True)
st.markdown('<div class="custom-label">Please enter your medical condition</div>', unsafe_allow_html=True)
input_condition = st.text_input("")
st.markdown('</div>', unsafe_allow_html=True)

# Generate the response when the button is clicked
if st.button("Get Advice"):
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    # Prompt for general tips
    prompt_tips = f"Give some general tips for managing {input_condition}"
    response_tips = model.generate_content([prompt_tips])
    
    # Prompt for cause of the disease
    prompt_cause = f"What are the possible causes of {input_condition}?"
    response_cause = model.generate_content([prompt_cause])
    
    # Display the responses side by side in columns with adjusted width
    col1, col2 = st.columns([1, 1])
    
    with col2:
        st.markdown('<h3 style="text-align:center;color:#333333;">General Tips</h3>', unsafe_allow_html=True)
        if response_tips and hasattr(response_tips, 'text'):
            st.text_area("", value=response_tips.text, height=400, max_chars=None)
        else:
            st.error("No response generated for general tips. Please try again.")
    
    with col1:
        st.markdown('<h3 style="text-align:center;color:#333333;">Cause of Disease</h3>', unsafe_allow_html=True)
        if response_cause and hasattr(response_cause, 'text'):
            st.text_area("", value=response_cause.text, height=400, max_chars=None)
        else:
            st.error("No response generated for cause of disease. Please try again.")

# Footer
st.markdown(
    """
    <div class="footer">
        Created By Team Nova | Health information for educational purposes only
    </div>
    """, unsafe_allow_html=True
)