# Generated by Django 5.0.1 on 2024-02-28 08:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('clinic', '0018_alter_doctor_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='workschedule',
            name='from_date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='workschedule',
            name='to_date',
            field=models.DateField(),
        ),
    ]
