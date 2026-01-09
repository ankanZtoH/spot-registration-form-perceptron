from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import SpotRegistration


class SpotRegistrationResource(resources.ModelResource):
    class Meta:
        model = SpotRegistration
        fields = (
            'id',
            'day',
            'name',
            'email',
            'phone',
            'event_name',
            'created_at',
        )
        export_order = fields


@admin.register(SpotRegistration)
class SpotRegistrationAdmin(ImportExportModelAdmin):
    resource_class = SpotRegistrationResource
    list_display = ('day', 'name', 'email', 'phone', 'event_name', 'created_at')
    search_fields = ('name', 'email', 'phone', 'event_name')
    list_filter = ('day', 'event_name')
