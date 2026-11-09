import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const runtime = globalThis as typeof globalThis & {
    process?: { env?: { PORT?: string } };
  };
  await app.listen(Number(runtime.process?.env?.PORT || 3000), "0.0.0.0");
}

bootstrap();
