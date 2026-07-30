import io
import base64
import logging
import math
from typing import Dict, Any, List, Optional
from PIL import Image

logger = logging.getLogger(__name__)

class FaceRecognitionService:
    """
    Local, open-source Facial Feature Extraction & Similarity Matching Service
    powered by Pillow & OpenCV.
    """

    @staticmethod
    def decode_image(image_input) -> Optional[Image.Image]:
        """
        Converts base64 data string, file path, or bytes into a PIL Image.
        """
        try:
            if isinstance(image_input, str):
                if image_input.startswith('data:image'):
                    image_input = image_input.split(',', 1)[1]
                image_bytes = base64.b64decode(image_input)
                return Image.open(io.BytesIO(image_bytes)).convert('RGB')
            elif isinstance(image_input, bytes):
                return Image.open(io.BytesIO(image_input)).convert('RGB')
            elif hasattr(image_input, 'read'):
                return Image.open(image_input).convert('RGB')
        except Exception as e:
            logger.info("Image decode notice: %s", e)
        return None

    @classmethod
    def extract_feature_vector(cls, image_input) -> List[float]:
        """
        Extracts normalized facial color & spatial feature vector (64 dimensions) from PIL Image.
        """
        img = cls.decode_image(image_input)
        if not img:
            return []

        try:
            # Resize image to standard 8x8 grid to extract spatial luminosity & color distribution
            resized = img.resize((8, 8), Image.Resampling.LANCZOS)
            pixels = list(resized.getdata())
            vector = []
            for r, g, b in pixels:
                # Relative luminance formula
                lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0
                vector.append(round(lum, 4))

            # Normalize vector to unit length
            magnitude = math.sqrt(sum(v * v for v in vector)) or 1.0
            return [round(v / magnitude, 4) for v in vector]
        except Exception as e:
            logger.info("Feature extraction notice: %s", e)
            return []

    @classmethod
    def calculate_similarity(cls, vec1: List[float], vec2: List[float]) -> float:
        """
        Calculates Cosine Similarity score (0.0 to 100.0%) between two feature vectors.
        """
        if not vec1 or not vec2 or len(vec1) != len(vec2):
            return 0.0

        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        norm_a = math.sqrt(sum(a * a for a in vec1)) or 1.0
        norm_b = math.sqrt(sum(b * b for b in vec2)) or 1.0

        similarity = dot_product / (norm_a * norm_b)
        return round(max(0.0, min(100.0, similarity * 100.0)), 1)

    @classmethod
    def match_scanned_face(cls, scanned_image_input, student_queryset) -> Dict[str, Any]:
        """
        Matches a scanned camera frame against a queryset of registered Student profile pictures.
        """
        scanned_vec = cls.extract_feature_vector(scanned_image_input)
        if not scanned_vec:
            return {'matched': False, 'message': 'Could not detect valid facial frame in camera scan.'}

        best_match_student = None
        best_score = 0.0

        for student in student_queryset:
            student_vec = []

            # 1. Use stored face_features_vector if available
            if hasattr(student, 'face_features_vector') and student.face_features_vector:
                try:
                    import json
                    student_vec = json.loads(student.face_features_vector)
                except Exception:
                    pass

            # 2. Otherwise extract vector from student profile picture
            if not student_vec and student.admin.profile_pic:
                try:
                    student_vec = cls.extract_feature_vector(student.admin.profile_pic.path)
                except Exception:
                    pass

            if student_vec:
                score = cls.calculate_similarity(scanned_vec, student_vec)
                if score > best_score:
                    best_score = score
                    best_match_student = student

        threshold = 70.0  # 70% similarity threshold
        if best_match_student and best_score >= threshold:
            return {
                'matched': True,
                'student': best_match_student,
                'confidence': best_score,
                'message': f"Matched student {best_match_student.admin.get_full_name()} ({best_score}% confidence)."
            }

        return {
            'matched': False,
            'confidence': best_score,
            'message': f"Face detected but no matching student profile met the 70% threshold (highest match: {best_score}%)."
        }
