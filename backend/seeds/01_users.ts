import { Knex } from "knex";
import { runAsync, defaultIterations } from "../helpers/helper-seed";
import { getServiceOptions } from "@feathersjs/feathers";
import { app } from '../src/app';

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries and releational
    await knex("natural-resource").del();
    await knex("building").del();
    await knex("professional").del();
    await knex("building-professional").del();
    await knex("users").del();

    const serviceOptions = getServiceOptions(app.service("users"));
    await runAsync(serviceOptions?.createFake)(serviceOptions?.fakerOptions?.iterations ?? defaultIterations);
};
