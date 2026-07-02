import os

def tinymce_api_key(request):
    return {
        'TINYMCE_API_KEY': os.environ.get('TINYMCE_API_KEY', 'no-api-key')
    }
