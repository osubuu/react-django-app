# Generated by Django 3.1 on 2020-09-04 12:56

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200904_0152'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='reservedbook',
            name='author',
        ),
        migrations.RemoveField(
            model_name='reservedbook',
            name='title',
        ),
    ]
