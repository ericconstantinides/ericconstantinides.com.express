"use strict";

(function () {
  /***
     Copyright 2013 Teun Duynstee
     Licensed under the Apache License, Version 2.0 (the "License");
     you may not use this file except in compliance with the License.
     You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
     Unless required by applicable law or agreed to in writing, software
     distributed under the License is distributed on an "AS IS" BASIS,
     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     See the License for the specific language governing permissions and
     limitations under the License.
  */
  var firstBy = function () {

    function identity(v) {
      return v;
    }
    function ignoreCase(v) {
      return typeof v === "string" ? v.toLowerCase() : v;
    }
    function makeCompareFunction(f, opt) {
      opt = typeof opt === "number" ? { direction: opt } : opt || {};
      if (typeof f != "function") {
        var prop = f;
        // make unary function
        f = function f(v1) {
          return !!v1[prop] ? v1[prop] : "";
        };
      }
      if (f.length === 1) {
        // f is a unary function mapping a single item to its sort score
        var uf = f;
        var preprocess = opt.ignoreCase ? ignoreCase : identity;
        f = function f(v1, v2) {
          return preprocess(uf(v1)) < preprocess(uf(v2)) ? -1 : preprocess(uf(v1)) > preprocess(uf(v2)) ? 1 : 0;
        };
      }
      if (opt.direction === -1) {
        return function (v1, v2) {
          return -f(v1, v2);
        };
      }
      return f;
    }

    /* adds a secondary compare function to the target function (`this` context)
       which is applied in case the first one returns 0 (equal)
       returns a new compare function, which has a `thenBy` method as well */
    function tb(func, opt) {
      var x = typeof this == "function" ? this : false;
      var y = makeCompareFunction(func, opt);
      var f = x ? function (a, b) {
        return x(a, b) || y(a, b);
      } : y;
      f.thenBy = tb;
      return f;
    }
    return tb;
  }();

  //—————————————————————————————————————————————————————————————————————

  function getData(accessPoint, successFunc, data) {
    var request = new XMLHttpRequest();
    request.open('GET', accessPoint, true);

    request.onload = function () {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        data = JSON.parse(this.response);
        successFunc(data);
      } else {
        // We reached our target server, but it returned an error
      }
    };
    request.onerror = function () {
      // There was a connection error of some sort
    };
    request.send();
  }

  var createSkills = function createSkills(skills) {
    function updateSkills(skills) {
      var sortedSkills = void 0;
      var skillsSort = false;
      if (skillsEl.querySelectorAll('input[type="checkbox"]')[0].checked) {
        if (skillsEl.querySelectorAll('input[type="checkbox"]')[1].checked) {
          // by skill type and years experience
          sortedSkills = skills.map(function (a) {
            return Object.assign({}, a);
          }).sort(firstBy('type').thenBy('yearStarted').thenBy('skill', { ignoreCase: true }));
        } else {
          // by skill type alphabetically
          sortedSkills = skills.map(function (a) {
            return Object.assign({}, a);
          }).sort(firstBy('type').thenBy('skill', { ignoreCase: true }));
        }
        // add in Skill Titles:
        skillsSort = true;
      } else {
        if (skillsEl.querySelectorAll('input[type="checkbox"]')[1].checked) {
          // by years experience alphabetically
          sortedSkills = skills.map(function (a) {
            return Object.assign({}, a);
          }).sort(firstBy('yearStarted').thenBy('skill', { ignoreCase: true }));
        } else {
          // alphabetically
          sortedSkills = skills.map(function (a) {
            return Object.assign({}, a);
          }).sort(firstBy('skill', { ignoreCase: true }));
        }
      }
      // clear out the lastType
      var lastType = '';
      var skillsHTML = sortedSkills.map(function (item) {
        // let's add the title
        if (skillsSort && item.type !== lastType) {
          var closeDiv = lastType === '' ? '' : '</div>\n</div>\n';
          lastType = item.type;
          return closeDiv + "<div class=\"skill-list__group\">\n<h2 class=\"skills__title\">" + lastType + "</h2>\n<div class=\"skill-list__inner-group\">" + themeSkillsItem(item);
        }
        return themeSkillsItem(item);
      }).join('\n');
      skillsHTML = skillsSort ? skillsHTML + "\n</div>\n</div>" : "\n<div class=\"skill-list__inner-group\">\n" + skillsHTML + "\n</div>";
      skillsHTML = "\n<div class=\"skills-list\">\n" + skillsHTML + "\n</div>";
      skillsEl.insertAdjacentHTML('beforeend', skillsHTML);
    }

    skillsEl.innerHTML = '<h3 class="checkbox__container">' + createCheckmark('skillType', 'Arrange by Skill Type', true) + createCheckmark('skillLevel', 'Arrange by Years Experience', false) + '</h3>';
    updateSkills(skills);

    (function skillsClick() {
      skillsEl.addEventListener('click', function (event) {
        if (event.target.id === 'skillLevel' || event.target.id === 'skillType') {
          skillsEl.removeChild(skillsEl.getElementsByClassName('skills-list')[0]);
          updateSkills(skills);
        }
      });
    })();
  };

  function themeSkillsItem(item) {
    var abbr = typeof item.abbr === 'undefined' ? '' : " (" + item.abbr + ")";
    var experience = new Date().getFullYear() - item.yearStarted + 1;
    var yearLabel = experience == 1 ? 'year' : 'years';
    return "<article class=\"skills-item\"\n        data-type=\"" + item.type + "\"><span class=\"skills__name\">" + item.skill + abbr + "</span>&nbsp;<span class=\"skills__experience\">(" + experience + " " + yearLabel + ")</span></article>";
  }

  function createCheckmark(id, labelText, checkIt) {
    var label = document.createElement('label');
    label.classList.add('checkbox__label');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'name';
    checkbox.value = 'value';
    if (checkIt) checkbox.setAttribute('checked', 'checked');
    checkbox.id = id;
    label.append(checkbox);
    label.insertAdjacentHTML('beforeend', labelText);
    return label.outerHTML;
  }

  var skillsEl = document.getElementById('skills');
  if (skillsEl) {
    var skills;
    getData('/skills.json', createSkills, skills);
  }
})();
//# sourceMappingURL=skills.js.map
