"""
Custom Router for Django REST Framework
Returns relative URLs instead of absolute URLs in API root views
"""
from rest_framework.routers import DefaultRouter, APIRootView
from rest_framework.response import Response
from rest_framework.reverse import reverse


class RelativeAPIRootView(APIRootView):
    """Custom API Root View that returns relative URLs instead of absolute URLs"""

    def get(self, request, *args, **kwargs):
        ret = {}
        namespace = request.resolver_match.namespace
        for key, url_name in self.api_root_dict.items():
            if namespace:
                url_name = namespace + ':' + url_name
            try:
                # Use request=None to generate relative URLs
                url = reverse(url_name, args=args, kwargs=kwargs, request=None, format=kwargs.get('format'))
                ret[key] = url
            except:
                # Fallback to request-based reverse if needed
                url = reverse(url_name, args=args, kwargs=kwargs, request=request, format=kwargs.get('format'))
                ret[key] = url
        return Response(ret)


class RelativeURLRouter(DefaultRouter):
    """Custom router that uses relative URLs in the API root view"""
    APIRootView = RelativeAPIRootView
