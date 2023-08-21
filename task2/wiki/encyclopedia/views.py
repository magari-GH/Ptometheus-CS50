import markdown2
from django.shortcuts import render
from markdown2 import markdown

from . import util


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })


def entry_f(request, title):
    title_name = f"{title.capitalize()}"
    text_html = util.get_entry(title)
    if text_html is None:
        text_html = f"Page {title.capitalize()} has not been found!"
    else:
        text_html = markdown(open(f"entries/{title}.md").read())
    return render(request, "encyclopedia/title.html", {
            "title_name": title_name,
            "text_html": text_html
})
