/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

angular.module('zeppelinWebApp').service('saveAsService', SaveAsService);

function SaveAsService(browserDetectService) {
  'ngInject';

  this.saveAs = function(content, filename, extension) {
    let BOM = '\uFEFF';
    if (browserDetectService.detectIE()) {
      angular.element('body').append('<iframe id="SaveAsId" style="display: none"></iframe>');
      let frameSaveAs = angular.element('body > iframe#SaveAsId')[0].contentWindow;
      content = BOM + content;
      frameSaveAs.document.open('text/json', 'replace');
      frameSaveAs.document.write(content);
      frameSaveAs.document.close();
      frameSaveAs.focus();
      let t1 = Date.now();
      frameSaveAs.document.execCommand('SaveAs', false, filename + '.' + extension);
      let t2 = Date.now();

      // This means, this version of IE dosen't support auto download of a file with extension provided in param
      // falling back to ".txt"
      if (t1 === t2) {
        frameSaveAs.document.execCommand('SaveAs', true, filename + '.txt');
      }
      angular.element('body > iframe#SaveAsId').remove();
    } else {
      const fileName = filename + '.' + extension;
      const json = JSON.stringify(content);
      const blob = new Blob([json], {type: 'octet/stream'});
      const url = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      document.body.appendChild(a);
      a.style = 'display: none';
      a.href = url;
      a.download = fileName;
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };
}
