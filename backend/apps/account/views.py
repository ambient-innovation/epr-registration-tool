from django.http import JsonResponse


def csrf_failure(request, reason=""):
    """
    Replacement for the default Django view csrf_failure.
    We want to return json instead of html since all our APIs are json based.
    """
    return JsonResponse({'error': 'csrf_failure'}, status=403)
