"""
Django settings for EPR-Tool project.

Generated by 'django-admin startproject' using Django 3.2.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/n
"""
import sys
from pathlib import Path

import environ

# Build paths inside the project like this: BASE_DIR / 'subdir'.
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
    # Sentry
    DJANGO_SENTRY_DSN=(str, ''),
    DJANGO_SENTRY_ENV=(str, 'local'),
)

# read default env variables
environ.Env.read_env()

# Test testing flag
IS_TESTING = False
if 'test' in sys.argv or 'test_coverage' in sys.argv:
    IS_TESTING = True

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env('DJANGO_SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool('DJANGO_DEBUG')

ALLOWED_HOSTS = env.list('DJANGO_ALLOWED_HOSTS')

# Application definition
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'axes',
    'strawberry.django',
]

LOCAL_APPS = [
    'common',
    'account',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

AUTH_USER_MODEL = 'account.User'


MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
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
        'DIRS': [],
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
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
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

AUTHENTICATION_BACKENDS = [
    # AxesBackend should be the first backend in the AUTHENTICATION_BACKENDS list.
    'axes.backends.AxesBackend',
    # Django ModelBackend is the default authentication backend.
    'django.contrib.auth.backends.ModelBackend',
]

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

# sentry
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
