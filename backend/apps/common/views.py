from django.utils.translation import gettext_lazy as _
from django.views import generic

from common.mixin import AdminViewMixin


class WikiView(AdminViewMixin, generic.TemplateView):
    template_name = 'common/wiki.html'
    admin_page_title = _('EPR Registration Tool | 👩🏻‍🏫 Wiki')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context
