module Jekyll
  class RenderLeadTextBlock < Liquid::Block

    def render(context)
      text = super
      site = context.registers[:site]
      converter = site.find_converter_instance(::Jekyll::Converters::Markdown)
      output = converter.convert(super(context))
      "<div class=\"font-sans-lg text-light\">#{converter.convert(output)}</div>"

    end

  end
end

Liquid::Template.register_tag('lead', Jekyll::RenderLeadTextBlock)
