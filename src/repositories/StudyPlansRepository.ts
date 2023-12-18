import * as queries from '../helpers/postgresQueriesHelper/studyPlanManagement';
import {
  PostgresAdapter,
  Plan,
  CustomError,
  IClientRequestData,
  EntityRepository,
} from '../studentcher-shared-utils';
import pgClient from '../storage/postgresAdapter';

export class StudyPlansRepository extends EntityRepository {
  static queries = queries;
  private pgClient: PostgresAdapter;

  constructor(pgClient) {
    super();
    this.pgClient = pgClient;
  }

  async addOne(data: IClientRequestData): Promise<Plan> {
    const insertStudyPlanQuery: string =
      StudyPlansRepository.queries.getInsertStudyPlanQuery();
    const insertStudyPlanValues: any = [data.planId, data.name];
    const insertStudyPlanActivityQuery: string =
      StudyPlansRepository.queries.getInsertStudyPlanActivityQuery();
    const insertPlanActivitiesQueriesBucket: string[] = [];
    const insertPlanActivitiesValuesBucket: any[] = [];

    data.activityIds.forEach((activityId, index) => {
      insertPlanActivitiesQueriesBucket.push(insertStudyPlanActivityQuery);
      insertPlanActivitiesValuesBucket.push([
        data.planId,
        activityId,
        index + 1,
      ]);
    });
    const sqlQueries: string[] = [
      insertStudyPlanQuery,
      ...insertPlanActivitiesQueriesBucket,
    ];
    const sqlValues: any[] = [
      insertStudyPlanValues,
      ...insertPlanActivitiesValuesBucket,
    ];
    const response: any = await this.pgClient.callDbTransaction(
      sqlQueries,
      sqlValues
    );
    const planActivitiesStartingIndex: number = 1;
    const plan: Plan = response[0].rows[0];

    for (
      let i = planActivitiesStartingIndex;
      i <
      insertPlanActivitiesQueriesBucket.length + planActivitiesStartingIndex;
      i++
    )
      plan.activities.push(response[i].rows[0].activityId);
    return plan;
  }

  async editOne(data: IClientRequestData): Promise<Plan> {
    const updatePlanQuery: string =
      StudyPlansRepository.queries.getUpdateStudyPlanQuery();
    const updatePlanValues: any[] = [data.planId, data.name];
    const deletePlanActivitiesQuery: string =
      StudyPlansRepository.queries.getDeleteStudyPlanActivitiesQuery();
    const deletePlanActivitiesValues: any[] = [data.planId];
    // const deletePlanActivitiesQuery1: string =
    //   StudyPlansRepository.queries.getDeleteStudyPlanActivitiesQueryFromUserActivityVideoStatusHistory();
    //   const deletePlanActivitiesValues1: any[] = [data.planId, data.activityIds];
    //   const deletePlanActivitiesQuery2: string =
    //     StudyPlansRepository.queries.getDeleteStudyPlanActivitiesQueryFromUserActivityMetaData();
    //   const deletePlanActivitiesValues2: any[] = [data.planId, data.activityIds];
    //   const deletePlanActivitiesQuery3: string =
    //     StudyPlansRepository.queries.getDeleteStudyPlanActivitiesQueryFromUserActivityHistory();
    //   const deletePlanActivitiesValues3: any[] = [data.planId, data.activityIds];
    //   const deletePlanActivitiesQuery4: string =
    //     StudyPlansRepository.queries.getDeleteStudyPlanActivitiesQueryFromPlanActivities();
    //   const deletePlanActivitiesValues4: any[] = [data.planId, data.activityIds];
    const insertStudyPlanActivityQuery: string =
      StudyPlansRepository.queries.getInsertStudyPlanActivityQuery();
    const insertPlanActivitiesQueriesBucket: string[] = [];
    const insertPlanActivitiesValuesBucket: any[] = [];

    const insertStudyPlanUserQuery: string =
      StudyPlansRepository.queries.getInsertUserPlansQuery();
    const insertPlanUsersValues: any[] = [data.planId, data.users];

    // const deleteUserPlansQuery: string =
    //   StudyPlansRepository.queries.getDeleteUserPlansQuery();
    // const insertUserPlansQuery: string =
    //   StudyPlansRepository.queries.getInsertUserPlansQuery();
    // const values = [data.planId, [...data.users]];

    data.activityIds.forEach((activityId, index) => {
      insertPlanActivitiesQueriesBucket.push(insertStudyPlanActivityQuery);
      insertPlanActivitiesValuesBucket.push([
        data.planId,
        activityId,
        index + 1,
      ]);
    });
    const sqlQueries = [
      updatePlanQuery,
      deletePlanActivitiesQuery,
      //   deletePlanActivitiesQuery1,
      //   deletePlanActivitiesQuery2,
      //   deletePlanActivitiesQuery3,
      //   deletePlanActivitiesQuery4,
      ...insertPlanActivitiesQueriesBucket,
      insertStudyPlanUserQuery,
    ];
    const sqlValues = [
      updatePlanValues,
      deletePlanActivitiesValues,
      //   deletePlanActivitiesValues1,
      //   deletePlanActivitiesValues2,
      //   deletePlanActivitiesValues3,
      //   deletePlanActivitiesValues4,
      ...insertPlanActivitiesValuesBucket,
      insertPlanUsersValues,
    ];
    const response = await this.pgClient.callDbTransaction(
      sqlQueries,
      sqlValues
    );
    if (response[0].rowCount === 0)
      throw new CustomError('Study Plan not found.', 404);
    const planActivitiesStartingIndex = 2;
    const plan = response[0].rows[0];
    for (
      let i = planActivitiesStartingIndex;
      i <
      insertPlanActivitiesQueriesBucket.length + planActivitiesStartingIndex;
      i++
    )
      plan.activities.push(response[i].rows[0].activityId);

    //   const addedUserIds: string[] = response[1].rows.reduce(
    //     (accumulator, { userId }) => accumulator.concat(userId),
    //     []
    //   );
    //   return addedUserIds;

    return plan;
  }

  async deleteMany(data: IClientRequestData): Promise<Plan[]> {
    const deleteStudyPlansQuery: string =
      StudyPlansRepository.queries.getDeleteStudyPlansQuery();
    const deleteStudyPlansValues: any = [data.planIds];
    const response: any = await this.pgClient.callDbCmd(
      deleteStudyPlansQuery,
      deleteStudyPlansValues
    );
    if (response.rowCount === 0)
      throw new CustomError('Study plans not found.', 404);
    return response.rows;
  }

  async findMany(_data: IClientRequestData): Promise<Plan[]> {
    const selectStudyPlansQuery: string =
      StudyPlansRepository.queries.getSelectStudyPlansQuery();
    const selectStudyPlansValues: any = [];
    const response = await this.pgClient.callDbCmd(
      selectStudyPlansQuery,
      selectStudyPlansValues
    );
    return response.rows;
  }

  async setUsers(data: IClientRequestData): Promise<string[]> {
    const deleteUserPlansQuery: string =
      StudyPlansRepository.queries.getDeleteUserPlansQuery();
    const insertUserPlansQuery: string =
      StudyPlansRepository.queries.getInsertUserPlansQuery();
    const values = [data.id, data.userIds];
    const sqlQueries: string[] = [deleteUserPlansQuery, insertUserPlansQuery];
    const sqlValues = [values, values];
    const response = await this.pgClient.callDbTransaction(
      sqlQueries,
      sqlValues
    );
    const addedUserIds: string[] = response[1].rows.reduce(
      (accumulator, { userId }) => accumulator.concat(userId),
      []
    );
    return addedUserIds;
  }
}

export default new StudyPlansRepository(pgClient);
