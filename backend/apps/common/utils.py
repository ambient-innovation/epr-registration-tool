import datetime
import functools
import time

from django.db import connection, reset_queries


def query_debugger(func):
    """
    The test runner sets settings.DEBUG to False, if you want to gather queries in test,
    settings.DEBUG needs to be True. There are two options:
        1. use `@override_settings(DEBUG=True)` with the function you are testing
        2. use `--debug-mode` as an extra argument when running tests
    """

    @functools.wraps(func)
    def inner_func(*args, **kwargs):
        from django.conf import settings

        if settings.DEBUG:
            print('Warning: DEBUG is True. The execution time will be longer.')
        else:
            print('Warning: DEBUG is False. Counting queries wont\'t work.')

        reset_queries()

        start_queries = len(connection.queries)

        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()

        end_queries = len(connection.queries)

        print(f"-----> Function : {func.__name__}")
        print(f"Number of Queries : {end_queries - start_queries}")
        print(f"Finished in : {(end - start):.2f}s")
        return result

    return inner_func


def execution_time_tracker(func):
    @functools.wraps(func)
    def inner_func(*args, **kwargs):
        from django.conf import settings

        if settings.DEBUG:
            print('Warning: DEBUG is on. The execution time will be longer.')

        start = time.perf_counter()
        result = func(*args, **kwargs)
        end = time.perf_counter()

        print(f"-----> Function : {func.__name__}")
        print(f"Finished in : {(end - start):.2f}s")
        return result

    return inner_func


def make_local_datetime_at(year, month, timezone_info, day=1, hour=0, minute=0):
    """
    create datetime in that timezone
    """
    import pytz

    naive_time = datetime.time(hour, minute)
    date = datetime.date(year=year, month=month, day=day)
    naive_datetime = datetime.datetime.combine(date, naive_time)
    tz = pytz.timezone(timezone_info)
    return tz.localize(naive_datetime)
