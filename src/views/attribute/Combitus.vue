<template>
  <div>
    <div v-if="!loaded"><aha-spinner /></div>
    <div v-if="loaded">
      <status-dropdown
        :projectStatuses="projectStatuses"
        :teamStatuses="teamStatuses"
        :projectStatusId="projectStatusId"
        :teamStatusId="teamStatusId"
        v-on:input="updateStatus"
      />
    </div>
  </div>
</template>
<script lang="ts">
import StatusDropdown from "./StatusDropdown.vue";

export default {
  components: { StatusDropdown },
  props: { record: { required: true } },
  data() {
    return {
      loaded: false,
      project: null,
      team: null,
      projectWorkflow: null,
      teamWorkflow: null,
      projectStatusId: null,
      teamStatusId: null,
    };
  },
  created() {
    this.loadStatuses();
  },
  computed: {
    projectStatuses() {
      return this.projectWorkflow?.workflowStatuses;
    },
    teamStatuses() {
      return this.teamWorkflow?.workflowStatuses;
    },
  },
  methods: {
    async loadStatuses() {
      this.loaded = false;

      const workflowType = this.record.typename.toLowerCase() + "Workflow";

      const statusQuery = aha.models.WorkflowStatus.select(
        "id",
        "name",
        "color",
        "position"
      );
      const workflowQuery = aha.models.Workflow.select("id").merge({
        workflowStatuses: statusQuery,
      });
      const projectQuery = aha.models.Project.select("id", "isTeam").merge({
        [workflowType]: workflowQuery,
      });
      /** @type {Aha.Feature} */
      const record = await this.record.constructor
        .select("id", "referenceNum")
        .merge({
          project: projectQuery,
          team: projectQuery,
          workflowStatus: statusQuery,
          teamWorkflowStatus: statusQuery,
        })
        .find(this.record.id);

      if (record.project?.isTeam) {
        this.team = record.project;
        this.teamStatusId =
          record.teamWorkflowStatus?.id || record.workflowStatus?.id;
        this.teamWorkflow = record.project[workflowType];
      } else {
        this.project = record.project;
        this.projectStatusId = record.workflowStatus?.id;
        this.projectWorkflow = record.project[workflowType];

        if (record.team) {
          this.team = record.team;
          this.teamStatusId = record.teamWorkflowStatus?.id;
          this.teamWorkflow = record.team[workflowType];
        }
      }

      this.loaded = true;
    },
    async updateStatus(statuses) {
      this.loaded = false;
      if (statuses.projectStatusId) {
        this.record.workflowStatus = { id: statuses.projectStatusId };
        this.projectStatusId = statuses.projectStatusId;
      }
      if (statuses.teamStatusId) {
        this.record.teamWorkflowStatus = { id: statuses.teamStatusId };
        this.teamStatusId = statuses.teamStatusId;
      }
      await this.record.save();
      this.loaded = true;
    },
  },
};
</script>
