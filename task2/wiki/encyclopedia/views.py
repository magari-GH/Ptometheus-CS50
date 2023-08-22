import markdown2
from django.shortcuts import render
from markdown2 import markdown
from . import util
from django import forms


class SearchForm(forms.Form):
    input_text = forms.CharField(label="Search Encyclopedia")


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries(),
        "form": SearchForm()
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
            "text_html": text_html,
            "form": SearchForm(),
            "entries": util.list_entries()
})




    #if request.method == "GET":
       # form = SearchForm(request.GET)
      #  if form.is_valid():
        #    title = form.cleaned_data["title"]