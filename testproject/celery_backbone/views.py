from django.shortcuts import render_to_response
from django.http import HttpResponse
from django.template import RequestContext
from django.core.serializers import serialize
from djcelery.models import TaskState

from django.views.generic import TemplateView

class TestPage(TemplateView):
    template_name = 'test_page.html'

def task_status(request):
    return render_to_response('task_status.html',
                              {},
                              context_instance=RequestContext(request))

def task_list_json(request):
    """ Returns JSON representing all tasks.
    """
    task_states = TaskState.objects.all()
    return HttpResponse(serialize('json', task_states),
                        mimetype='application/json')
