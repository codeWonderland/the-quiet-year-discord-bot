// project.js

class Project {
    constructor(name, weeks) {
      this.name = name;
      this.weeks = weeks;
      this.is_complete = false;
      this.failed = false;
    }
  
    pass_time() {
        if (this.failed || this.is_complete) {
            return false;
        }

        if (this.weeks > 0) {
            this.weeks = this.weeks - 1;
        }

        if (this.weeks === 0 && this.failed === false && this.is_complete === false) {
            this.is_complete = true;
            return true;
        }

        return false;
    }

    finish() {
        this.weeks = 0;
        this.is_complete = true;
    }

    fail() {
        this.is_complete = false;
        this.failed = false;
    }
  }
  
  export default Project;
  