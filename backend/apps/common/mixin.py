from django.contrib import admin
from django.views import generic


class AdminViewMixin(generic.View):
    """
    Mixin to provide a custom view with all the attributes it needs to look like a regular django admin page.
    """

    model = None
    admin_page_title = None

    def get_admin_context(self):
        opts = self.model._meta if self.model else None
        return {
            **admin.site.each_context(self.request),
            'title': self.admin_page_title,
            'name': self.admin_page_title,
            'opts': opts,
            'app_label': opts.app_label if opts else None,
        }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context.update(self.get_admin_context())
        return context
