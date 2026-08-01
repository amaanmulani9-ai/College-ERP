from rest_framework import serializers

from .models import Client, Domain


class DomainSerializer(serializers.ModelSerializer):
    class Meta:
        model = Domain
        fields = ["id", "domain", "is_primary"]


class ClientSerializer(serializers.ModelSerializer):
    domains = DomainSerializer(many=True, read_only=True)
    primary_domain = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Client
        fields = [
            "id",
            "name",
            "slug",
            "schema_name",
            "contact_email",
            "contact_phone",
            "is_active",
            "subscription_plan",
            "trial_expiry",
            "created_at",
            "updated_at",
            "domains",
            "primary_domain",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        primary_domain = validated_data.pop("primary_domain", None)
        client = Client.objects.create(**validated_data)
        if primary_domain:
            Domain.objects.create(domain=primary_domain, tenant=client, is_primary=True)
        return client
