function checkHealth() {
    const heartRateInput = document.getElementById('heartRate');
    const bloodPressureInput = document.getElementById('bloodPressure');
    const bloodSugarInput = document.getElementById('bloodSugar');
    const hemoglobinInput = document.getElementById('hemoglobin');

    if (!heartRateInput.value || !bloodPressureInput.value || !bloodSugarInput.value || !hemoglobinInput.value) {
        alert('Enter the specific data accordingly first');
        return;
    }

    const heartRate = parseInt(heartRateInput.value);
    const bloodPressure = bloodPressureInput.value.split('/');
    const bloodSugar = parseInt(bloodSugarInput.value);
    const hemoglobin = parseFloat(hemoglobinInput.value);
    
    let resultText = '';
    let precautionsText = '';

    // Heart Rate Check
    if (heartRate < 60 || heartRate > 100) {
        resultText += 'Heart rate is abnormal. Normal range is 60-100 bpm.\n';
        precautionsText += 'Precautions for abnormal heart rate:\n- Avoid strenuous activities until checked by a doctor.\n- Monitor your heart rate regularly.\n- Maintain a healthy diet and avoid caffeine and alcohol.\n- Consult a healthcare professional for further evaluation.\n\n';
    } else {
        resultText += 'Heart rate is normal.\n\n';
    }

    // Blood Pressure Check
    if (bloodPressure.length === 2) {
        const systolic = parseInt(bloodPressure[0]);
        const diastolic = parseInt(bloodPressure[1]);
        if (systolic > 120 || diastolic > 80) {
            resultText += 'Blood pressure is high. Normal is 120/80 mmHg.\n';
            precautionsText += 'Precautions for high blood pressure:\n- Reduce salt intake.\n- Exercise regularly.\n- Avoid smoking and limit alcohol consumption.\n- Manage stress through relaxation techniques.\n- Follow your doctor\'s advice and medication if prescribed.\n\n';
        } else {
            resultText += 'Blood pressure is normal.\n\n';
        }
    } else {
        resultText += 'Blood pressure format is incorrect. Use e.g., 120/80.\n';
    }

    // Blood Sugar Check
    if (bloodSugar > 100) {
        resultText += 'Blood sugar is high. Normal fasting blood sugar is less than 100 mg/dL.\n';
        precautionsText += 'Precautions for high blood sugar:\n- Follow a balanced diet low in sugar and refined carbs.\n- Exercise regularly to help control blood sugar.\n- Monitor your blood sugar levels as advised.\n- Consult a healthcare provider for diagnosis and treatment.\n\n';
    } else {
        resultText += 'Blood sugar is normal.\n\n';
    }

    // Hemoglobin Check
    if (hemoglobin < 13.8 || hemoglobin > 17.2) {
        resultText += 'Hemoglobin level is abnormal. Normal range is 13.8-17.2 g/dL for men.\n';
        precautionsText += 'Precautions for abnormal hemoglobin levels:\n- If low, increase intake of iron-rich foods like spinach, red meat, and beans.\n- Avoid excessive alcohol consumption.\n- Consult a healthcare professional for further tests and treatment.\n\n';
    } else {
        resultText += 'Hemoglobin level is normal.\n\n';
    }

    document.getElementById('result').innerText = resultText + '\n' + precautionsText;
}

// User Authentication Logic

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;

            if (localStorage.getItem('user_' + username)) {
                alert('Username already exists. Please choose another.');
                return;
            }

            localStorage.setItem('user_' + username, password);
            alert('Registration successful. You can now login.');
            // Switch to login form
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('loginForm').style.display = 'block';
            document.getElementById('toggleText').innerText = "Don't have an account? Register here.";
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const storedPassword = localStorage.getItem('user_' + username);
            if (storedPassword && storedPassword === password) {
                localStorage.setItem('loggedInUser', username);
                alert('Login successful!');
                window.location.href = 'index.htm';
            } else {
                alert('Invalid username or password.');
            }
        });
    }
});

// Check login status on protected pages
function checkLogin() {
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        window.location.href = 'login.htm';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.htm';
}

// Profile data handling

function loadUserProfile() {
    const username = localStorage.getItem('loggedInUser');
    if (!username) return;

    const profileData = JSON.parse(localStorage.getItem('profile_' + username) || '{}');
    const profilePic = document.getElementById('profilePic');
    const profileName = document.getElementById('profileName');

    if (profileData.picture) {
        profilePic.src = profileData.picture;
        profilePic.style.display = 'inline-block';
    } else {
        profilePic.style.display = 'none';
    }

    profileName.textContent = profileData.fullName || username;
}

function loadUserProfileForm() {
    const username = localStorage.getItem('loggedInUser');
    if (!username) return;

    const profileData = JSON.parse(localStorage.getItem('profile_' + username) || '{}');

    document.getElementById('fullName').value = profileData.fullName || '';
    document.getElementById('email').value = profileData.email || '';
    document.getElementById('phone').value = profileData.phone || '';
    // Profile picture input cannot be prefilled for security reasons
}

document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = localStorage.getItem('loggedInUser');
            if (!username) return;

            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const profileImageInput = document.getElementById('profileImage');

            if (profileImageInput.files && profileImageInput.files[0]) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const picture = event.target.result;
                    saveUserProfile(username, fullName, email, phone, picture);
                };
                reader.readAsDataURL(profileImageInput.files[0]);
            } else {
                saveUserProfile(username, fullName, email, phone, null);
            }
        });
    }
});

function saveUserProfile(username, fullName, email, phone, picture) {
    const profileData = {
        fullName: fullName,
        email: email,
        phone: phone,
    };
    if (picture) {
        profileData.picture = picture;
    } else {
        const existingData = JSON.parse(localStorage.getItem('profile_' + username) || '{}');
        if (existingData.picture) {
            profileData.picture = existingData.picture;
        }
    }
    localStorage.setItem('profile_' + username, JSON.stringify(profileData));
    alert('Profile saved successfully!');
    loadUserProfile();
}
