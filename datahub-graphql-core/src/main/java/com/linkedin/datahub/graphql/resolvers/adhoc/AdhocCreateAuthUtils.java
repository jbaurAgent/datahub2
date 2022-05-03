package com.linkedin.datahub.graphql.resolvers.adhoc;

import com.datahub.authorization.Authorizer;
import com.google.common.collect.ImmutableList;
import com.linkedin.datahub.graphql.QueryContext;
import com.linkedin.metadata.authorization.PoliciesConfig;
import javax.annotation.Nonnull;
import static com.linkedin.datahub.graphql.resolvers.AuthUtils.*;

public class AdhocCreateAuthUtils {

  public static boolean canCreateAdhocDatasets(@Nonnull QueryContext context) {
    final Authorizer authorizer = context.getAuthorizer();
    final String principal = context.getActorUrn();
    return isAuthorized(principal, ImmutableList.of(PoliciesConfig.CREATE_DATASET_PRIVILEGE.getType()), authorizer);
  }  

  private AdhocCreateAuthUtils() { }
}
