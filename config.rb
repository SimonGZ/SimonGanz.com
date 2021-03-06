###
# Compass
###

# Susy grids in Compass
require 'kramdown'
require 'builder'

# Change Compass configuration
# compass_config do |config|
#   config.output_style = :compact
# end

###
# Haml
###

# CodeRay syntax highlighting in Haml
# First: gem install haml-coderay
# require 'haml-coderay'

# CoffeeScript filters in Haml
# First: gem install coffee-filter
# require 'coffee-filter'

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

###
# Page command
###

# Per-page layout changes:
#
# With no layout
# page "/path/to/file.html", :layout => false
#
# With alternative layout
# page "/path/to/file.html", :layout => :otherlayout
#
# A path which all have the same layout
# with_layout :admin do
#   page "/admin/*"
# end

Time.zone = "America/Los_Angeles"

page "/*.html", layout: "article_layout"

page "/feed.xml", :layout => false
page "/sitemap.xml", :layout => false

# Proxy (fake) files
# page "/this-page-has-no-template.html", :proxy => "/template-file.html" do
#   @which_fake_page = "Rendering a fake page with a variable"
# end

###
# Helpers
###

# Methods defined in the helpers block are available in templates
helpers do
  # Calculate the years for a copyright
  def copyright_years(start_year)
    end_year = Date.today.year
    if start_year == end_year
      start_year.to_s
    else
      start_year.to_s + '-' + end_year.to_s
    end
  end

  # Holder.js image placeholder helper
  def img_holder(opts = {})
    return "Missing Image Dimension(s)" unless opts[:width] && opts[:height]
    return "Invalid Image Dimension(s)" unless opts[:width].to_s =~ /^\d+$/ && opts[:height].to_s =~ /^\d+$/

    img  = "<img data-src=\"holder.js/#{opts[:width]}x#{opts[:height]}/auto"
    img << "/#{opts[:bgcolor]}:#{opts[:fgcolor]}" if opts[:fgcolor] && opts[:bgcolor]
    img << "/text:#{opts[:text].gsub(/'/,"\'")}" if opts[:text]
    img << "\" width=\"#{opts[:width]}\" height=\"#{opts[:height]}\">"

    img
  end
  
  def linklog?(article)
    return true unless article.data.external_url.nil?
  end
  
  def post_url(article)
    return linklog?(article) ? article.data.external_url : article.url
  end
  
  def selected_class(current_page, selected_nav)
    return selected_nav == current_page.data.selected_nav ? "selected" : nil
  end

end

# Change the CSS directory
# set :css_dir, "alternative_css_directory"

# Change the JS directory
# set :js_dir, "alternative_js_directory"

# Change the images directory
# set :images_dir, "alternative_image_directory"

set :images_dir, "images"

set :markdown_engine, :kramdown
set :markdown, :layout_engine => :erb, 
               :tables => true, 
               :autolink => true,
               :smartypants => true

# Build-specific configuration
configure :build do
  activate :asset_hash
  # Turning on cache system to fight github's aggressive cacheing.
  
  # For example, change the Compass output style for deployment
  activate :minify_css

  # Minify Javascript on build
  activate :minify_javascript

  # Use GZip compression where available
  # activate :gzip

  # Enable cache buster
  # activate :cache_buster

  # Use relative URLs
  # activate :relative_assets

  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher

  # Or use a different image path
  # set :http_path, "/Content/images/"
end

activate :blog do |blog|
  # set options on blog
  blog.permalink = ":year/:month/:title.html"
  blog.paginate = true
  blog.layout = "article_layout"
  blog.default_extension = ".markdown.erb"
end

activate :directory_indexes
page "/404.html", directory_index: false
