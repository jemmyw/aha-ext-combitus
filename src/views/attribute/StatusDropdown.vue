<template>
  <div
    @keyup.down="moveDown"
    @keyup.up="moveUp"
    class="wrapper"
    @clickaway="hide"
  >
    <div class="buttonWrapper">
      <div @click="toggle" class="value" ref="toggleButton">
        <aha-pill
          v-if="projectStatus"
          v-bind:color="statusColor(projectStatus)"
          stacked
        >
          {{ projectStatus.name }}
        </aha-pill>
        <aha-pill
          v-if="teamStatus"
          v-bind:color="statusColor(teamStatus)"
          editable
          sibling
        >
          {{ teamStatus.name }}
        </aha-pill>
      </div>
    </div>

    <div
      class="dropdown"
      ref="dropdown"
      v-bind:style="{ display: isOpen ? 'flex' : 'none' }"
    >
      <ul class="project-statuses" v-if="projectStatuses">
        <li
          v-for="(item, index) in projectStatuses"
          :key="index"
          :class="{ active: item.id === setProjectStatusId }"
          :style="{
            backgroundColor: statusColor(item, item.id === setProjectStatusId),
          }"
          @click="setProjectStatus(item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
      <ul class="team-statuses" v-if="teamStatuses">
        <li
          v-for="(item, index) in teamStatuses"
          :key="index"
          :class="{ active: item.id === setTeamStatusId }"
          :style="{
            backgroundColor: statusColor(item, item.id === setTeamStatusId),
          }"
          @click="setTeamStatus(item.id)"
        >
          {{ item.name }}
        </li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import Color from "color";
import { mixin as clickaway } from "vue-clickaway";

export default {
  mixins: [clickaway],
  props: {
    projectStatusId: { type: String },
    teamStatusId: { type: String },
    projectStatuses: { type: Array },
    teamStatuses: { type: Array },
  },
  data() {
    return {
      isOpen: false,
      index: -1,
      setProjectStatusId: this.$props.projectStatusId,
      setTeamStatusId: this.$props.teamStatusId,
      projectSet: false,
      teamSet: false,
    };
  },
  methods: {
    toggle() {
      if (this.isOpen) {
        this.hide();
      } else {
        this.show();
      }
    },
    hide() {
      this.isOpen = false;
      if (this.projectSet || this.teamSet) {
        this.$emit("input", {
          projectStatusId: this.setProjectStatusId,
          teamStatusId: this.setTeamStatusId,
        });
      }
    },
    show() {
      this.isOpen = true;
      this.projectSet = false;
      this.teamSet = false;

      this.$refs.dropdown.style.minWidth =
        this.$refs.toggleButton.offsetWidth - 5 + "px";
    },
    statusColor(status, active = false) {
      return Color(status.color)
        .mix(Color.rgb(255, 255, 255), 0.6)
        .hex();
    },
    setProjectStatus(id) {
      this.setProjectStatusId = id;
      this.projectSet = true;
      this.allSet();
    },
    setTeamStatus(id) {
      this.setTeamStatusId = id;
      this.teamSet = true;
      this.allSet();
    },
    allSet() {
      if (
        (!this.projectStatuses || this.projectSet) &&
        (!this.teamStatuses || this.teamSet)
      ) {
        this.hide();
      }
    },
  },
  computed: {
    projectStatus() {
      return this.projectStatuses?.find(
        (status) => status.id === this.setProjectStatusId
      );
    },
    teamStatus() {
      return this.teamStatuses?.find(
        (status) => status.id === this.setTeamStatusId
      );
    },
  },
};
</script>
<style scoped>
.wrapper {
}

.buttonWrapper {
  display: flex;
  cursor: pointer;
}

.value {
  display: flex;
}

.dropdown {
  position: absolute;
  padding: 5px;
  gap: 5px;
  background-color: var(--theme-secondary-background);
  border: 1px solid var(--theme-secondary-border);
  border-radius: 3px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 999;
  display: flex;
  font-size: 80%;
}

.dropdown ul {
  flex-grow: 1;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

li {
  margin: 0;
  padding: 3px 5px;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 2px;
  cursor: pointer;
  filter: saturate(50%);
}

li:hover {
  border: 1px solid #999;
  filter: saturate(100%);
}

li.active {
  border: 1px solid #666;
  filter: saturate(100%);
}
</style>
