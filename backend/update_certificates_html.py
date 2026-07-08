import os

filepath = r'c:\Users\Amaan\OneDrive\Desktop\College-ERP-main\College-ERP-main\frontend\templates\hod_template\certificates.html'

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

import re

# 1. Replace the form panel
form_panel_replacement = """            <div class="form-panel">
                <form action="{% url 'admin_certificates' %}" method="POST">
                    {% csrf_token %}
                    <div class="form-title">Generate Certificate</div>
                    <div class="form-legend">
                        <span><div class="dot-req"></div> Required*</span>
                        <span><div class="dot-opt"></div> Optional</span>
                    </div>

                    <div class="form-group-rounded">
                        <label>Select Template*</label>
                        <select class="form-control-rounded" name="template_id" id="template_id" required title="select">
                            <option value="" disabled selected>Select a Template</option>
                            {% for template in templates %}
                            <option value="{{ template.id }}" data-applicable="{{ template.applicable_for }}">{{ template.title }} (For {{ template.applicable_for }})</option>
                            {% endfor %}
                        </select>
                    </div>
                    
                    <div class="form-group-rounded">
                        <label>Recipient Type*</label>
                        <input type="text" class="form-control-rounded" id="recipient_type" name="recipient_type" readonly required title="input">
                    </div>
                    
                    <div class="form-group-rounded">
                        <label>Select Recipient*</label>
                        <select class="form-control-rounded" name="recipient_id" id="recipient_id" required disabled title="select">
                            <option value="" disabled selected>-- Select Recipient --</option>
                            <!-- Populated dynamically via JS -->
                        </select>
                    </div>

                    <div class="form-group-rounded optional">
                        <label>Custom Text</label>
                        <input type="text" class="form-control-rounded" name="custom_text" id="custom_text" placeholder="e.g., Outstanding Performance" title="input">
                    </div>
                    
                    <div class="form-group-rounded">
                        <label>Date*</label>
                        <input type="date" class="form-control-rounded" name="issue_date" id="issue_date" required title="input" placeholder="Enter value">
                    </div>

                    <button type="submit" class="btn-generate"><i class="fas fa-certificate"></i> Generate Certificate</button>
                </form>
            </div>"""

pattern_form = r'\s*<div class="form-panel">.*?</div>\s*<div class="preview-panel">'
content = re.sub(r'<div class="form-panel">.*?</button>\s*</div>', form_panel_replacement, content, flags=re.DOTALL)

# 2. Add custom js block if not exists
js_block = """
{% block custom_js %}
<script>
    // Set default date to today
    document.getElementById('issue_date').valueAsDate = new Date();

    const studentOptions = [
        {% for student in students %}
        { id: "{{ student.admin.id }}", name: "{{ student.admin.get_full_name }}" },
        {% endfor %}
    ];

    const staffOptions = [
        {% for staff in staffs %}
        { id: "{{ staff.admin.id }}", name: "{{ staff.admin.get_full_name }}" },
        {% endfor %}
    ];

    document.getElementById('template_id').addEventListener('change', function() {
        const selectedOption = this.options[this.selectedIndex];
        const applicableFor = selectedOption.getAttribute('data-applicable');
        const recipientTypeInput = document.getElementById('recipient_type');
        const recipientSelect = document.getElementById('recipient_id');
        
        recipientTypeInput.value = applicableFor || '';
        
        // Clear options
        recipientSelect.innerHTML = '<option value="" disabled selected>-- Select Recipient --</option>';
        
        if (applicableFor === 'Student') {
            studentOptions.forEach(opt => {
                recipientSelect.innerHTML += `<option value="${opt.id}">${opt.name}</option>`;
            });
            recipientSelect.disabled = false;
        } else if (applicableFor === 'Staff') {
            staffOptions.forEach(opt => {
                recipientSelect.innerHTML += `<option value="${opt.id}">${opt.name}</option>`;
            });
            recipientSelect.disabled = false;
        } else {
            recipientSelect.disabled = true;
        }
    });
</script>
{% endblock custom_js %}
"""

if "{% block custom_js %}" not in content:
    content += js_block

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated certificates.html successfully")
