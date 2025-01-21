from django.http import JsonResponse
from .models import Featured_Services, Specialist, Partner_Clinic, AboutPage_Team, Service

def home(request):
    featured_services = list(Featured_Services.objects.values())
    specialists = list(Specialist.objects.values())
    partner_clinics = list(Partner_Clinic.objects.values())

    # Return data in JSON format
    return JsonResponse({
        'featured_services': featured_services,
        'specialists': specialists,
        'partner_clinics': partner_clinics,
    })

def about(request):
    aboutpage_team = list(AboutPage_Team.objects.values())
    return JsonResponse({
        'aboutpage_team': aboutpage_team,
    })

def services(request):
    services = list(Service.objects.values())
    return JsonResponse({
        'services': services,
    })
