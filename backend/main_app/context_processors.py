import os

def locale_settings(request):
    """Exposes country, language, and currency parameters to all templates."""
    # Read from session, fallback to defaults
    country = request.session.get('selected_country', 'IN')
    lang = request.session.get('selected_lang', 'en')
    
    # Establish currency parameters relative to base (USD)
    if country == 'AE':
        symbol = 'د.إ'
        rate = 3.67
    else:
        # Default is India (IN)
        symbol = '₹'
        rate = 83.0

    return {
        'selected_country': country,
        'selected_lang': lang,
        'currency_symbol': symbol,
        'currency_rate': rate
    }
