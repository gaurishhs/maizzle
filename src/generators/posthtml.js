const fm = require('front-matter')
const posthtml = require('posthtml')
const fetch = require('posthtml-fetch')
const outlook = require('posthtml-mso')
const layouts = require('posthtml-extend')
const modules = require('posthtml-modules')
const includes = require('posthtml-include')
const expressions = require('posthtml-expressions')
const { getPropValue } = require('../utils/helpers')

module.exports = async (html, config) => {
  const layoutsOpts = getPropValue(config, 'build.layouts') || {}
  const modulesOpts = getPropValue(config, 'build.components') || {}
  const includeOpts = getPropValue(config, 'build.includes') || {}
  const fetchOpts = getPropValue(config, 'build.posthtml.fetch') || {}
  const outlookOpts = getPropValue(config, 'build.posthtml.outlook') || {}
  const posthtmlOpts = getPropValue(config, 'build.posthtml.options') || {}
  const posthtmlPlugins = getPropValue(config, 'build.posthtml.plugins') || []
  const expressionsOpts = getPropValue(config, 'build.posthtml.expressions') || {}

  return posthtml([
    layouts({ strict: false, ...layoutsOpts }),
    includes({ ...includeOpts }),
    outlook({ ...outlookOpts }),
    fetch({ ...fetchOpts }),
    modules({ tag: 'component', attribute: 'src', ...modulesOpts }),
    expressions({ ...expressionsOpts, locals: { page: config } }),
    ...posthtmlPlugins
  ])
    .process(html, { ...posthtmlOpts })
    .then(result => fm(result.html).body)
    .catch(error => { throw error })
}