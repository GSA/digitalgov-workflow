# {% lead %} / {% endlead %}
module Jekyll
  class RenderLeadTextBlock < Liquid::Block

    def render(context)
      text = super
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      output = converter.convert(super(context))
      "<div class=\"lead font-sans-lg text-light\">#{converter.convert(output)}</div>"

    end

  end
end

Liquid::Template.register_tag('lead', Jekyll::RenderLeadTextBlock)


# {% note %} / {% endnote %}
module Jekyll
  class RenderNoteTextBlock < Liquid::Block

    def render(context)
      text = super
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      output = converter.convert(super(context))
      "<div class=\"note font-sans-xs padding-2 radius-md bg-accent-warm-lightest text-light\">#{output}</div>"

    end

  end
end

Liquid::Template.register_tag('note', Jekyll::RenderNoteTextBlock)


# {% footnote %} / {% endfootnote %}
module Jekyll
  class RenderNoteFootNoteBlock < Liquid::Block

    def render(context)
      text = super
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      output = converter.convert(super(context))
      "<div class=\"footnote margin-top-6 border-top-1px border-base font-sans-2xs text-light\">#{output}</div>"
    end

  end
end

Liquid::Template.register_tag('footnote', Jekyll::RenderNoteFootNoteBlock)
