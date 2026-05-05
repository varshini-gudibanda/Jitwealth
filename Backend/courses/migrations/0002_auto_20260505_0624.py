# Custom migration to handle unsupported ALTER TABLE operation
from django.db import migrations

def custom_migration(apps, schema_editor):
    # Get the Course model
    Course = apps.get_model('courses', 'Course')


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(custom_migration),
    ]
