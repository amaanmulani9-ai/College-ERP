import re
import io
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class DocumentOCRService:
    """
    Open-source, zero-cost Document OCR & Format Verification Service.
    Extracts text from PDFs and images, and performs validation for Indian identity documents
    (Aadhaar, PAN) and academic marksheets.
    """

    @staticmethod
    def extract_text_from_file(file_path_or_bytes, filename: str = "") -> str:
        """
        Extracts text from PDF or Image file.
        """
        text = ""
        is_pdf = filename.lower().endswith('.pdf') or (isinstance(file_path_or_bytes, str) and file_path_or_bytes.lower().endswith('.pdf'))

        if is_pdf:
            # 1. Try pdfplumber
            try:
                import pdfplumber
                if isinstance(file_path_or_bytes, str):
                    with pdfplumber.open(file_path_or_bytes) as pdf:
                        text = "\n".join([page.extract_text() or "" for page in pdf.pages])
                else:
                    with pdfplumber.open(io.BytesIO(file_path_or_bytes)) as pdf:
                        text = "\n".join([page.extract_text() or "" for page in pdf.pages])
                if text.strip():
                    return text.strip()
            except Exception as e:
                logger.info("pdfplumber notice: %s", e)

            # 2. Try pypdf fallback
            try:
                import pypdf
                if isinstance(file_path_or_bytes, str):
                    reader = pypdf.PdfReader(file_path_or_bytes)
                else:
                    reader = pypdf.PdfReader(io.BytesIO(file_path_or_bytes))
                text = "\n".join([page.extract_text() or "" for page in reader.pages])
                if text.strip():
                    return text.strip()
            except Exception as e:
                logger.info("pypdf notice: %s", e)

        # 3. Image Tesseract OCR fallback
        try:
            from PIL import Image
            import pytesseract

            if isinstance(file_path_or_bytes, str):
                image = Image.open(file_path_or_bytes)
            else:
                image = Image.open(io.BytesIO(file_path_or_bytes))

            ocr_text = pytesseract.image_to_string(image)
            if ocr_text.strip():
                return ocr_text.strip()
        except Exception as e:
            logger.info("pytesseract image OCR notice: %s", e)

        return text.strip()

    @classmethod
    def validate_aadhaar(cls, text: str, expected_name: Optional[str] = None, expected_dob: Optional[str] = None) -> Dict[str, Any]:
        """
        Validates 12-digit Aadhaar pattern, extracts Aadhaar number, and checks name/DOB alignment.
        """
        clean_text = text.replace('-', ' ').replace('\n', ' ')
        aadhaar_pattern = r'\b[2-9]{1}[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\b'
        matches = re.findall(aadhaar_pattern, clean_text)
        
        aadhaar_no = matches[0].replace(' ', '') if matches else ""
        valid_format = bool(aadhaar_no and len(aadhaar_no) == 12)

        reasons = []
        score = 0

        if valid_format:
            score += 50
        else:
            reasons.append("12-digit Aadhaar number pattern not detected.")

        # Name matching
        name_matched = False
        if expected_name and expected_name.strip():
            name_parts = [p.lower() for p in expected_name.strip().split() if len(p) > 2]
            found_parts = sum(1 for part in name_parts if part in text.lower())
            if name_parts and (found_parts / len(name_parts)) >= 0.5:
                name_matched = True
                score += 35
            else:
                reasons.append(f"Student name '{expected_name}' not strongly matched in Aadhaar document.")
        else:
            score += 35  # Neutral if name comparison not provided

        # DOB matching
        if expected_dob and str(expected_dob) in text:
            score += 15
        elif expected_dob:
            reasons.append("Date of Birth string not explicitly found on document.")

        status = "Verified" if score >= 80 and valid_format else ("Flagged" if score >= 50 else "Rejected")

        return {
            'valid_format': valid_format,
            'aadhaar_no': aadhaar_no,
            'score': score,
            'status': status,
            'name_matched': name_matched,
            'reasons': reasons,
            'extracted_text_snippet': text[:300]
        }

    @classmethod
    def validate_pan(cls, text: str, expected_name: Optional[str] = None) -> Dict[str, Any]:
        """
        Validates 10-character PAN card format: [A-Z]{5}[0-9]{4}[A-Z]{1}
        """
        pan_pattern = r'\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b'
        matches = re.findall(pan_pattern, text.upper())
        pan_no = matches[0] if matches else ""
        valid_format = bool(pan_no)

        score = 70 if valid_format else 20
        reasons = [] if valid_format else ["10-character PAN pattern (e.g. ABCDE1234F) not found."]

        return {
            'valid_format': valid_format,
            'pan_no': pan_no,
            'score': score,
            'status': "Verified" if valid_format else "Rejected",
            'reasons': reasons,
            'extracted_text_snippet': text[:300]
        }

    @classmethod
    def extract_marksheet_summary(cls, text: str) -> Dict[str, Any]:
        """
        Extracts percentage, marks, and passing indicators from marksheets.
        """
        pct_pattern = r'(\d{2,3}(?:\.\d{1,2})?)\s*%'
        pct_matches = re.findall(pct_pattern, text)
        percentage = float(pct_matches[0]) if pct_matches else 0.0

        is_passed = "pass" in text.lower() or "successful" in text.lower() or percentage >= 35.0
        score = 85 if (percentage > 0 or is_passed) else 40

        return {
            'percentage': percentage,
            'is_passed': is_passed,
            'score': score,
            'status': "Verified" if is_passed else "Pending Manual Review",
            'extracted_text_snippet': text[:300]
        }
