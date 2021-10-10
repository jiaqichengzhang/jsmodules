/**
 * css转json对象
 * author：liupeng
 * githubUrl: https://github.com/search?q=css+js&type=Repositories
 */
class Cssjson {
      // String functions
      // String.prototype.trim = function() {
      //     return this.replace(/^\s+|\s+$/g, '')
      // }

      // String.prototype.repeat = function(n) {
      //     return new Array(1 + n).join(this)
      // }
  // var selX = /([^\s\;\{\}][^\;\{\}]*)\{/g
  // var endX = /\}/g
  // var lineX = /([^\;\{\}]*)\;/g

  /**
   * Input is css string and current pos, returns JSON object
   *
   * @param cssString
   *            The CSS string.
   * @param args
   *            An optional argument object. ordered: Whether order of
   *            comments and other nodes should be kept in the output. This
   *            will return an object where all the keys are numbers and the
   *            values are objects containing "name" and "value" keys for each
   *            node. comments: Whether to capture comments. split: Whether to
   *            split each comma separated list of selectors.
   */
   toJSON(cssString, args) {
    if (!cssString.endsWith(';')) cssString = cssString + ';'
    var commentX = /\/\*[\s\S]*?\*\//g
    var lineAttrX = /([^\:]+):([^\;]*);/
    // This is used, a concatenation of all above. We use alternation to
    // capture.
    var altX = /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gmi
    // Capture groups
    var capComment = 1
    var capEnd = 3
    var capAttr = 4
    var isEmpty = function(x) {
        return typeof x == 'undefined' || x.length == 0 || x == null
    }
      var node = {
          attributes: {}
      }
      var match = null
      var count = 0

      if (typeof args == 'undefined') {
           args = {
              ordered: false,
              comments: false,
              stripComments: false,
              split: false
          }
      }
      if (args.stripComments) {
          args.comments = false
          cssString = cssString.replace(commentX, '')
      }
      while ((match = altX.exec(cssString)) != null) {
          if (!isEmpty(match[capComment]) && args.comments) {
              // Comment
              var add = match[capComment].trim()
              node[count++] = add
          } else if (!isEmpty(match[capEnd])) {
              // Node has finished
              return node
          } else if (!isEmpty(match[capAttr])) {
              var line = match[capAttr].trim()
              var attr = lineAttrX.exec(line)
              if (attr) {
                  // Attribute
                  let name = attr[1].trim()
                  var value = attr[2].trim()
                  if (args.ordered) {
                      let obj = {}
                      obj['name'] = name
                      obj['value'] = value
                      obj['type'] = 'attr'
                      node[count++] = obj
                  } else {
                      if (name in node.attributes) {
                          var currVal = node.attributes[name]
                          if (!(currVal instanceof Array)) {
                              node.attributes[name] = [currVal]
                          }
                          node.attributes[name].push(value)
                      } else {
                          node.attributes[name] = value
                      }
                  }
              } else {
                  // Semicolon terminated line
                  node[count++] = line
              }
          }
      }

      return node
  }
}
export default new Cssjson()
