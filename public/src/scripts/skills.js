(function() {
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
  var firstBy = (function() {

    function identity(v){ return v; }
    function ignoreCase(v){ return typeof(v) === "string" ? v.toLowerCase() : v; }
    function makeCompareFunction(f, opt){
      opt = typeof(opt) === "number" ? { direction:opt } : opt || {};
      if (typeof(f) != "function") {
        let prop = f;
        // make unary function
        f = v1 => !!v1[prop] ? v1[prop] : "";
      }
      if (f.length === 1) {
        // f is a unary function mapping a single item to its sort score
        var uf = f;
        var preprocess = opt.ignoreCase ? ignoreCase : identity;
        f = (v1,v2) => preprocess(uf(v1)) < preprocess(uf(v2)) ? -1 : preprocess(uf(v1)) > preprocess(uf(v2)) ? 1 : 0;
      }
      if (opt.direction === -1) {
        return (v1,v2) => -f(v1,v2);
      }
      return f;
    }

    /* adds a secondary compare function to the target function (`this` context)
       which is applied in case the first one returns 0 (equal)
       returns a new compare function, which has a `thenBy` method as well */
    function tb(func, opt) {
      var x = typeof(this) == "function" ? this : false;
      var y = makeCompareFunction(func, opt);
      var f = x ? ((a, b) => x(a,b) || y(a,b)) : y;
      f.thenBy = tb;
      return f;
    }
    return tb;
  })();

  //—————————————————————————————————————————————————————————————————————

  function getData(accessPoint, successFunc, data) {
    let request = new XMLHttpRequest();
    request.open('GET', accessPoint, true);

    request.onload = function() {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        data = JSON.parse(this.response);
        successFunc(data);
      } else {
        // We reached our target server, but it returned an error
      }
    };
    request.onerror = function() {
      // There was a connection error of some sort
    };
    request.send();
  }

  const createSkills = function(skills) {
    function updateSkills(skills) {
      let sortedSkills;
      let skillsSort = false;
      if ( skillsEl.querySelectorAll('input[type="checkbox"]')[0].checked ) {
        if ( skillsEl.querySelectorAll('input[type="checkbox"]')[1].checked ) {
          // by skill type and years experience
          sortedSkills = skills.map(a => Object.assign({}, a)).sort(firstBy('type').thenBy('yearStarted').thenBy('skill', {ignoreCase:true}));
        } else {
          // by skill type alphabetically
          sortedSkills = skills.map(a => Object.assign({}, a)).sort(firstBy('type').thenBy('skill', {ignoreCase:true}));
        }
        // add in Skill Titles:
        skillsSort = true;
      } else {
        if ( skillsEl.querySelectorAll('input[type="checkbox"]')[1].checked ) {
          // by years experience alphabetically
          sortedSkills = skills.map(a => Object.assign({}, a)).sort(firstBy('yearStarted').thenBy('skill', {ignoreCase:true}));
        } else {
          // alphabetically
          sortedSkills = skills.map(a => Object.assign({}, a)).sort(firstBy('skill', {ignoreCase:true}));
        }
      }
      // clear out the lastType
      let lastType = '';
      let skillsHTML = sortedSkills.map(item => {
        // let's add the title
        if (skillsSort && item.type !== lastType) {
          let closeDiv = lastType === '' ? '' : '</div>\n</div>\n';
          lastType = item.type;
          return `${closeDiv}<div class="skill-list__group">\n<h2 class="skills__title">${lastType}</h2>\n<div class="skill-list__inner-group">${themeSkillsItem(item)}`;
        }
        return themeSkillsItem(item);
      }).join('\n');
      skillsHTML = skillsSort ? `${skillsHTML}\n</div>\n</div>` : `\n<div class="skill-list__inner-group">\n${skillsHTML}\n</div>`;
      skillsHTML = `\n<div class="skills-list">\n${skillsHTML}\n</div>`;
      skillsEl.insertAdjacentHTML('beforeend', skillsHTML);
    }

    skillsEl.innerHTML = '<h3 class="checkbox__container">' + createCheckmark('skillType', 'Arrange by Skill Type', true) + createCheckmark('skillLevel', 'Arrange by Years Experience', false) + '</h3>';
    updateSkills(skills);

    (function skillsClick() {
      skillsEl.addEventListener('click', function(event) {
        if (event.target.id === 'skillLevel' || event.target.id === 'skillType') {
          skillsEl.removeChild(skillsEl.getElementsByClassName('skills-list')[0]);
          updateSkills(skills);
        }
      });
    })()
  }


  function themeSkillsItem(item) {
    let abbr = typeof item.abbr === 'undefined' ? '' : ` (${item.abbr})`;
    let experience = (new Date().getFullYear()) - item.yearStarted + 1;
    let yearLabel = experience == 1 ? 'year' : 'years';
    return (
      `<article class="skills-item"
        data-type="${item.type}"><span class="skills__name">${item.skill}${abbr}</span>&nbsp;<span class="skills__experience">(${experience} ${yearLabel})</span></article>`
    );
  }

  function createCheckmark(id, labelText, checkIt) {
    let label = document.createElement('label');
    label.classList.add('checkbox__label');
    let checkbox = document.createElement('input');
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