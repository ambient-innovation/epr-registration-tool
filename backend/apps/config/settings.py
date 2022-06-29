"""
Django settings for EPR-Tool project.

Generated by 'django-admin startproject' using Django 3.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/n
"""
import os
import sys
from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
from corsheaders.defaults import default_methods

BASE_DIR = Path(__file__).resolve().parent.parent.parent

# To make apps are findable without a prefix
sys.path.append(str(BASE_DIR / "apps"))

env = environ.Env(
    # Django
    DJANGO_DEBUG=(bool, False),
    DJANGO_SECRET_KEY=(str, '!hTrYYVEfQb2wM9tG*PEh@K384Wtuvxgg@8dGrwWQEGZH9@oa9'),
    DJANGO_STATIC_ROOT=(str, 'staticfiles'),
    DJANGO_MEDIA_ROOT=(str, 'media'),
    DJANGO_SERVER_URL=(str, 'http://localhost:8000'),
    DJANGO_FRONTEND_URL=(str, 'http://localhost:3000'),
    DJANGO_ALLOWED_HOSTS=(list, ['127.0.0.1', 'localhost', '0.0.0.0']),
    # Database
    DATABASE_HOST=(str, ''),
    DATABASE_NAME=(str, ''),
    DATABASE_PORT=(str, ''),
    DATABASE_USERNAME=(str, ''),
    DATABASE_PASSWORD=(str, ''),
    USE_POSTGRES_DATABASE=(bool, True),
    # Django Axes
    AXES_ENABLED=(bool, True),
    ATOMIC_REQUESTS=(bool, True),
    AXES_FAILURE_LIMIT=(int, 5),
    AXES_RESET_ON_SUCCESS=(bool, False),
    AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP=(bool, True),
    AXES_USE_USER_AGENT=(bool, True),
    AXES_ONLY_ADMIN_SITE=(bool, True),
    # Graphql
    DJANGO_GRAPHQL_CSRF_EXEMPT=(bool, False),
    # Security
    DJANGO_COOKIE_DOMAIN=(str, 'localhost'),
    DJANGO_CORS_ORIGIN_WHITELIST=(list, []),
    DJANGO_CSRF_TRUSTED_ORIGINS=(list, []),
    # Sentry
    DJANGO_SENTRY_DSN=(str, ''),
    DJANGO_SENTRY_ENV=(str, 'local'),
    # AWS
    AWS_ACCESS_KEY_ID=(str, None),
    AWS_SECRET_ACCESS_KEY=(str, None),
    # Email
    DJANGO_EMAIL_BACKEND=(str, 'django.core.mail.backends.console.EmailBackend'),
    DJANGO_EMAIL_HOST=(str, None),
    DJANGO_EMAIL_PORT=(str, None),
    DJANGO_AWS_SES_ENABLED=(bool, False),
    DJANGO_DEFAULT_FROM_EMAIL=(str, 'noreply@ambient.digital'),
    # dev
    ENABLE_DEBUG_TOOLBAR=(bool, False),
)

# read default env variables
environ.Env.read_env()

# Test testing flag
IS_TESTING = False
if 'test' in sys.argv or 'test_coverage' in sys.argv:
    IS_TESTING = True

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DJANGO_DEBUG')

# Application definition
DJANGO_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'axes',
    'strawberry.django',
    'rest_framework',
    'corsheaders',
    'ai_django_core',
    'ai_kit_auth',
    'modeltranslation',
]

LOCAL_APPS = [
    'config.admin.CustomAdminConfig',
    'common',
    'packaging',
    'packaging_report',
    'account',
    'company',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

AUTH_USER_MODEL = 'account.User'

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.locale.LocaleMiddleware',
    # AxesMiddleware should be the last middleware in the MIDDLEWARE list.
    # It only formats user lockout messages and renders Axes lockout responses
    # on failed user authentication attempts from login views.
    # If you do not want Axes to override the authentication response
    # you can skip installing the middleware and use your own views.
    'axes.middleware.AxesMiddleware',
]

MEDIA_ROOT = env('DJANGO_MEDIA_ROOT')
MEDIA_URL = '/media/'

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = env('DJANGO_STATIC_ROOT')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

STATICFILES_DIRS = ('static',)

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': ['templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'config.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

if not env.bool('USE_POSTGRES_DATABASE'):
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': env('DATABASE_NAME'),
            'USER': env('DATABASE_USERNAME'),
            'PASSWORD': env('DATABASE_PASSWORD'),
            'HOST': env('DATABASE_HOST'),
            'PORT': env('DATABASE_PORT'),
        }
    }

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'account.password_validation.MinimumLengthValidator'},
    {'NAME': 'account.password_validation.ContainsUppercaseLetterValidator'},
    {'NAME': 'account.password_validation.ContainsLowercaseLetterValidator'},
    {'NAME': 'account.password_validation.ContainsNumberValidator'},
    {'NAME': 'account.password_validation.ContainsSpecialCharacterValidator'},
]

# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

FRONTEND_URL = env('DJANGO_FRONTEND_URL')
BASE_URL = env("DJANGO_SERVER_URL")

# ---- SECURITY --- #

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY')

AUTHENTICATION_BACKENDS = [
    # AxesBackend should be the first backend in the AUTHENTICATION_BACKENDS list.
    'axes.backends.AxesBackend',
    # Django ModelBackend is the default authentication backend.
    'django.contrib.auth.backends.ModelBackend',
]

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS')
CORS_ORIGIN_WHITELIST = env.list('DJANGO_CORS_ORIGIN_WHITELIST')
CORS_ALLOWED_ORIGINS = (f'{FRONTEND_URL}',)
CORS_ALLOW_METHODS = default_methods
CORS_ALLOW_CREDENTIALS = True

# store csrf token in a cookie instead of the user session
# --> this is needed so next.js can receive the csrf token directly from the browser
CSRF_USE_SESSIONS = False

CSRF_FAILURE_VIEW = 'account.views.csrf_failure'
CSRF_COOKIE_DOMAIN = env.str('DJANGO_COOKIE_DOMAIN')
CSRF_TRUSTED_ORIGINS = env.list('DJANGO_CSRF_TRUSTED_ORIGINS')

GRAPHQL_CSRF_EXEMPT = env.bool('DJANGO_GRAPHQL_CSRF_EXEMPT')

SESSION_EXPIRE_AT_BROWSER_CLOSE = True
SESSION_COOKIE_DOMAIN = env.str('DJANGO_COOKIE_DOMAIN')

# configuration for the django-axes package to log the login-attempts
if env.bool('AXES_ENABLED'):
    from datetime import timedelta

    AXES_COOLOFF_TIME = timedelta(minutes=10)
    AXES_FAILURE_LIMIT = env.int('AXES_FAILURE_LIMIT')
    AXES_RESET_ON_SUCCESS = env.bool('AXES_RESET_ON_SUCCESS')
    AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP = env.bool('AXES_LOCK_OUT_BY_COMBINATION_USER_AND_IP')
    AXES_USE_USER_AGENT = env.bool('AXES_USE_USER_AGENT')
    AXES_ONLY_ADMIN_SITE = env.bool('AXES_ONLY_ADMIN_SITE')
else:
    AXES_ENABLED = False

# --- SENTRY --- #

# Scrubbing Sensitive Data
if env('DJANGO_SENTRY_DSN'):
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn=env('DJANGO_SENTRY_DSN'),
        integrations=[DjangoIntegration()],
        max_breadcrumbs=50,
        debug=DEBUG,
        environment=env('DJANGO_SENTRY_ENV'),
        server_name=FRONTEND_URL,
    )
ENABLE_DEBUG_TOOLBAR = env.bool('ENABLE_DEBUG_TOOLBAR')
if ENABLE_DEBUG_TOOLBAR:
    MIDDLEWARE += ('debug_toolbar.middleware.DebugToolbarMiddleware',)
    INSTALLED_APPS += ('debug_toolbar',)
    # http://django-debug-toolbar.readthedocs.org/en/latest/installation.html
    INTERNAL_IPS = ['127.0.0.1', '0.0.0.0', '10.0.2.2']
    import socket

    # tricks to have debug toolbar when developing with docker
    ip = socket.gethostbyname(socket.gethostname())
    INTERNAL_IPS += [ip[:-1] + '1']

# django model translations settings
MODELTRANSLATION_FALLBACK_LANGUAGES = ('en',)

LANGUAGES = (
    ('en', 'English'),
    ('ar', 'Arabic'),
)

# django-ai-auth-kit settings
AI_KIT_AUTH = {
    "FRONTEND": {
        "URL": FRONTEND_URL,
        "RESET_PW_ROUTE": "/auth/forget-password/reset",
    },
    "USE_AI_KIT_AUTH_ADMIN": False,
    "USERNAME_REQUIRED": False,
    "ENABLE_ENDPOINTS": {
        "LOGIN": True,
        "LOGOUT": True,
        "ME": False,
        "VALIDATE_PASSWORD": False,
        "ACTIVATE_EMAIL": True,
        "SEND_PW_RESET_MAIL": True,
        "RESET_PASSWORD": True,
        "REGISTER": False,
    },
    "USER_IDENTITY_FIELDS": ('email',),
    'SEND_RESET_PW_MAIL': 'account.email.send_reset_password_mail',
}

# --- AWS --- #

if env('AWS_ACCESS_KEY_ID') and env('AWS_SECRET_ACCESS_KEY'):
    AWS_ACCESS_KEY_ID = env('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = env('AWS_SECRET_ACCESS_KEY')

# --- EMAIL settings --- #

DEFAULT_FROM_EMAIL = env.str('DJANGO_DEFAULT_FROM_EMAIL')

if env.bool('DJANGO_AWS_SES_ENABLED') and env('AWS_ACCESS_KEY_ID') and env('AWS_SECRET_ACCESS_KEY'):
    EMAIL_BACKEND = 'django_ses.SESBackend'
    AWS_SES_REGION_NAME = 'eu-central-1'
    AWS_SES_REGION_ENDPOINT = 'email.eu-central-1.amazonaws.com'
else:
    EMAIL_BACKEND = env.str('DJANGO_EMAIL_BACKEND')
    EMAIL_HOST = env.str('DJANGO_EMAIL_HOST')
    EMAIL_PORT = env.str('DJANGO_EMAIL_PORT')

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
    },
}
