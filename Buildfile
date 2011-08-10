# ==========================================================================
# Project:   Kiosque
# Copyright: @2011 My Company, Inc.
# ==========================================================================

# Add initial buildfile information here
config :all, :required => [:"sproutcore/core_foundation", :"sproutcore/datastore", :"sproutcore/animation", :"sproutcore/foundation", :"sproutcore/desktop"], :theme => "sproutcore/empty_theme"

config :kiosque, :required => [:"iweb/iweb"], :theme => "sproutcore/ace", :css_theme => "ace.kiosque"


