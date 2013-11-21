xml.instruct!
xml.feed "xmlns" => "http://www.w3.org/2005/Atom" do
  xml.title "SimonGanz.com"
  xml.id "http://simonganz.com/"
  xml.link "href" => "http://simonganz.com/"
  xml.link "href" => "http://simonganz.com/feed.xml", "rel" => "self"
  xml.updated blog.articles.first.date.to_time.iso8601
  xml.author { xml.name "Simon Ganz" }

  blog.articles[0..5].each do |article|
    xml.entry do
      xml.title ( linklog?(article) ? "→ " : "" ) + article.title + ( linklog?(article) ? " [link]" : "" )
      xml.link "rel" => "alternate", "href" => post_url(article)
      xml.id "http://simonganz.com#{article.url}"
      xml.published article.date.to_time.iso8601
      xml.updated article.date.to_time.iso8601
      xml.author { xml.name "Simon Ganz" }
      # xml.summary article.summary, "type" => "html"
      xml.content do
        xml.div article.body
        linklog?(article) ? xml.p { xml.a( { href: "http://simonganz.com#{article.url}" }, 'Permalink' ) } : nil
      end
    end
  end
end